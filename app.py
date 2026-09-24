"""
FreeAI Tools — backend.
100% free AI image / voice / story-video generation. No API keys, no login (launch).

Run locally:
    pip install -r requirements.txt
    python -m uvicorn app:app --host 127.0.0.1 --port 8000
Then open http://127.0.0.1:8000
"""
import asyncio
import hashlib
import os
import subprocess
import textwrap
import time
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import quote

import edge_tts
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from limits import LIMITS, BANNED_WORDS, VOICES, DEFAULT_VOICE, FORMATS
from limits import IMAGE_MODELS, DEFAULT_IMAGE_MODEL, VIDEO_STYLES

# httpx (used for Pollinations) crashes parsing bracketed IPv6 entries like
# [::1] in no_proxy. The proxy is never needed for loopback, so drop them.
for _var in ("no_proxy", "NO_PROXY"):
    _val = os.environ.get(_var)
    if _val:
        os.environ[_var] = ",".join(
            p for p in _val.split(",")
            if not (p.strip().startswith("[") and p.strip().endswith("]"))
        )

BASE_DIR = Path(__file__).parent
DATA_DIR = Path(os.environ.get("DATA_DIR", BASE_DIR / "data"))

# SITE_URL — single source of truth for this site's public domain.
# Used for absolute sitemap locs; canonical/OG tags in frontend/*.html use the
# same placeholder so one swap covers everything. At deploy:
#   sed -i 's|https://freeforge.onrender.com|https://REAL-DOMAIN|g' app.py frontend/index.html frontend/pages/*.html frontend/pages/blog/*.html
SITE_URL = "https://freeforge.onrender.com"
CACHE_IMG = DATA_DIR / "cache" / "images"
CACHE_AUD = DATA_DIR / "cache" / "audio"
JOBS_DIR = DATA_DIR / "jobs"
for d in (CACHE_IMG, CACHE_AUD, JOBS_DIR):
    d.mkdir(parents=True, exist_ok=True)
FRONTEND_DIR = BASE_DIR / "frontend"

# Font for burned-in captions (first one that exists on the system).
# Bengali font is picked per-scene when the narration contains Bengali script
# (DejaVu has no Bengali glyphs — captions would render as tofu boxes).
FONT_PATH = next(
    (p for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ] if os.path.exists(p)),
    None,
)
FONT_BENGALI = next(
    (p for p in [
        "/usr/share/fonts/truetype/noto/NotoSansBengali-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoSansBengali-SemiBold.ttf",
    ] if os.path.exists(p)),
    None,
)


def _caption_font(narration: str):
    import re
    if FONT_BENGALI and re.search(r"[\u0980-\u09FF]", narration):
        return FONT_BENGALI
    return FONT_PATH

# Browser UA: some upstreams (Cloudflare-fronted APIs) block default python UAs.
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/126.0.0.0 Safari/537.36"}

POLLINATIONS = "https://image.pollinations.ai/prompt"


# ---------------------------------------------------------------- rate limits
class TokenBucket:
    """Per-IP token bucket. capacity = daily quota, refills gradually over 24h."""

    def __init__(self, capacity: int):
        self.capacity = float(capacity)
        self.tokens = float(capacity)
        self.refill_per_s = capacity / 86400.0
        self.updated = time.monotonic()

    def take(self) -> bool:
        now = time.monotonic()
        self.tokens = min(self.capacity, self.tokens + (now - self.updated) * self.refill_per_s)
        self.updated = now
        if self.tokens >= 1.0:
            self.tokens -= 1.0
            return True
        return False


_buckets: dict[tuple[str, str], TokenBucket] = {}


def client_ip(request: Request) -> str:
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_limit(request: Request, kind: str) -> None:
    """kind: 'image' | 'voice' | 'video' -> raises 429 when the daily quota is spent."""
    key = (client_ip(request), kind)
    bucket = _buckets.get(key)
    if bucket is None:
        bucket = _buckets[key] = TokenBucket(LIMITS[f"{kind}_per_day_per_ip"])
    if not bucket.take():
        raise HTTPException(
            status_code=429,
            detail=f"Daily free limit reached for {kind} generation. "
                   f"It resets gradually — still 100% free, no account needed.",
        )


def check_banned(text: str) -> None:
    # Word-boundary match so innocent words like "brave" (contains "rape")
    # don't get blocked — only whole-word hits count.
    import re
    for w in BANNED_WORDS:
        if re.search(rf"(?<![a-z]){re.escape(w)}(?![a-z])", text.lower()):
            raise HTTPException(status_code=400,
                                detail="That prompt isn't allowed. Please try something else.")


# ---------------------------------------------------------------- image
_img_lock = asyncio.Lock()
_last_img_fetch = 0.0


def _img_key(prompt: str, w: int, h: int, model: str) -> str:
    return hashlib.sha256(f"{model}|{prompt}|{w}|{h}".encode()).hexdigest()


def _cached_image(key: str):
    for ext in ("jpg", "jpeg", "png", "webp"):
        p = CACHE_IMG / f"{key}.{ext}"
        if p.exists():
            return p
    return None


async def fetch_image(prompt: str, w: int, h: int,
                    model: str = DEFAULT_IMAGE_MODEL) -> Path:
    """Fetch (or reuse cached) AI image from Pollinations.

    Respects the upstream soft limit (min interval between fetches) and
    retries transient upstream failures with backoff — story jobs die
    too easily otherwise.
    """
    key = _img_key(prompt, w, h, model)
    hit = _cached_image(key)
    if hit:
        return hit
    url = (f"{POLLINATIONS}/{quote(prompt, safe='')}?width={w}&height={h}"
           f"&nologo=true&model={quote(model, safe='')}")
    for attempt in range(3):
        async with _img_lock:
            global _last_img_fetch
            wait = LIMITS["upstream_image_min_interval_s"] - (time.monotonic() - _last_img_fetch)
            if wait > 0:
                await asyncio.sleep(wait)
            try:
                async with httpx.AsyncClient(headers=UA, timeout=180,
                                             follow_redirects=True) as c:
                    r = await c.get(url)
                _last_img_fetch = time.monotonic()
                ctype = r.headers.get("content-type", "")
                if r.status_code == 200 and ctype.startswith("image/"):
                    ext = {"image/jpeg": "jpg", "image/png": "png",
                           "image/webp": "webp"}.get(ctype.split(";")[0].strip(), "jpg")
                    p = CACHE_IMG / f"{key}.{ext}"
                    p.write_bytes(r.content)
                    return p
            except Exception:
                _last_img_fetch = time.monotonic()
                pass
        if attempt < 2:
            await asyncio.sleep(10 * (attempt + 1))  # 10s, 20s — outside the lock
    raise HTTPException(status_code=502,
                        detail="Image service is busy right now. Please try again in a moment.")


# ---------------------------------------------------------------- voice
def _voice_key(text: str, voice: str) -> str:
    return hashlib.sha256(f"{voice}|{text}".encode()).hexdigest()


async def make_voice(text: str, voice: str) -> Path:
    """TTS via edge-tts (Microsoft Edge, free, no key). Cached on disk."""
    key = _voice_key(text, voice)
    p = CACHE_AUD / f"{key}.mp3"
    if p.exists():
        return p
    await edge_tts.Communicate(text, voice).save(str(p))
    return p


# ---------------------------------------------------------------- ffmpeg helpers
async def _run(cmd: list[str]) -> None:
    proc = await asyncio.to_thread(subprocess.run, cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {proc.stderr[-2000:]}")


async def audio_duration(path: Path) -> float:
    proc = await asyncio.to_thread(
        subprocess.run,
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True)
    try:
        return max(float(proc.stdout.strip()), 2.0)
    except ValueError:
        return 5.0


def _write_caption(path: Path, narration: str, w: int) -> None:
    wrap = 30 if w <= 1080 else 48
    lines = textwrap.wrap(narration, width=wrap)[:8]
    path.write_text("\n".join(lines), encoding="utf-8")


async def _build_scene(workdir: Path, idx: int, img: Path, narration_mp3: Path,
                      narration: str, fmt: str, zoom_in: bool) -> Path:
    """One scene clip: Ken Burns zoompan over the image for the narration length,
    captions burned in, soft background tone mixed very low."""
    W, H = FORMATS[fmt]["w"], FORMATS[fmt]["h"]
    dur = await audio_duration(narration_mp3)
    frames = int(dur * LIMITS["video_fps"])
    out = workdir / f"scene{idx}.mp4"
    cap = workdir / f"cap{idx}.txt"
    _write_caption(cap, narration, W)

    # zoompan needs a bigger-than-output frame for smooth zoom
    big_w, big_h = W * 2, H * 2
    zexpr = "min(max(zoom,pzoom)+0.0012,1.25)" if zoom_in else "max(max(zoom,pzoom)-0.0012,0.85)"
    vf = (f"scale={big_w}:{big_h}:force_original_aspect_ratio=increase,"
          f"crop={big_w}:{big_h},"
          f"zoompan=z='{zexpr}':d={frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
          f":s={W}x{H}:fps={LIMITS['video_fps']}")
    font = _caption_font(narration)
    if font:
        fs = 46 if W <= 1080 else 42
        ypos = f"h-{300 if W <= 1080 else 170}"
        vf += (f",drawtext=fontfile={font}:textfile={cap}:fontsize={fs}:"
               f"fontcolor=white:borderw=2:bordercolor=black@0.8:"
               f"x=(w-text_w)/2:y={ypos}")

    cmd = ["ffmpeg", "-y", "-i", str(img), "-i", str(narration_mp3)]
    af = "[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo[a0]"
    if LIMITS["bg_tone_enabled"]:
        # gentle low pad tone mixed very quietly under the narration
        cmd += ["-f", "lavfi", "-i", f"sine=frequency=110:duration={dur:.2f}"]
        vol = LIMITS["bg_tone_volume"]
        af += (f";[2:a]aformat=sample_fmts=fltp:channel_layouts=stereo,volume={vol}[bg];"
               f"[a0][bg]amix=inputs=2:duration=first:dropout_transition=0[a]")
    else:
        af += ";[a0]anull[a]"
    cmd += ["-filter_complex", f"[0:v]{vf}[v];{af}",
            "-map", "[v]", "-map", "[a]",
            "-t", f"{dur:.2f}",
            "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
            str(out)]
    await _run(cmd)
    return out


# ---------------------------------------------------------------- motion videos
# (Text to Video + Photo Animator): Ken Burns-style camera moves applied with
# ffmpeg. These are MOTION-style videos, not generative AI video — never claim
# otherwise in UI copy. The picker is called "Video style", never "AI model".

def _motion_zoompan(style: str, frames: int) -> str:
    """zoompan filter fragment for the chosen camera move.

    zoompan supports `on` (output frame count, 0..frames-1) and `zoom`.
    x/y stay inside [0, iw-iw/zoom] so the pan never leaves the frame.
    """
    if style == "pan-right":
        z = "1.3"
        x = f"min(0.0015*on*iw,iw-iw/zoom)"
        y = "ih/2-(ih/zoom/2)"
    elif style == "kenburns-mix":
        z = f"min(1+0.0012*on,1.22)"
        x = f"iw/2-(iw/zoom/2)+0.0006*on*iw"
        y = "ih/2-(ih/zoom/2)"
    else:  # "zoom-in" (default)
        z = f"min(1+0.0018*on,1.3)"
        x = "iw/2-(iw/zoom/2)"
        y = "ih/2-(ih/zoom/2)"
    return z, x, y


async def _build_motion_video(workdir: Path, img: Path, out: Path,
                             fmt: str, style: str) -> Path:
    """5-second motion clip: single image + Ken Burns move + soft background
    tone (same gentle pad as story videos). Returns the output path."""
    W, H = FORMATS[fmt]["w"], FORMATS[fmt]["h"]
    dur = float(LIMITS["motion_video_seconds"])
    frames = int(dur * LIMITS["video_fps"])
    z, x, y = _motion_zoompan(style, frames)
    # scale to 2x so the zoompan has pixels to move through smoothly
    big_w, big_h = W * 2, H * 2
    vf = (f"scale={big_w}:{big_h}:force_original_aspect_ratio=increase,"
          f"crop={big_w}:{big_h},"
          f"zoompan=z='{z}':d={frames}:x='{x}':y='{y}'"
          f":s={W}x{H}:fps={LIMITS['video_fps']}")
    cmd = ["ffmpeg", "-y", "-i", str(img),
           "-f", "lavfi", "-i", f"sine=frequency=110:duration={dur:.2f}",
           "-filter_complex",
           f"[0:v]{vf}[v];[1:a]aformat=sample_fmts=fltp:channel_layouts=stereo,"
           f"volume={LIMITS['bg_tone_volume']}[a]",
           "-map", "[v]", "-map", "[a]",
           "-t", f"{dur:.2f}",
           "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
           str(out)]
    await _run(cmd)
    return out


# ---------------------------------------------------------------- story jobs
class SceneIn(BaseModel):
    narration: str = Field(min_length=1, max_length=LIMITS["story_narration_max_chars"])
    imagePrompt: str = Field(min_length=1, max_length=LIMITS["story_image_prompt_max_chars"])


class StoryIn(BaseModel):
    scenes: list[SceneIn] = Field(min_length=1, max_length=LIMITS["story_max_scenes"])
    format: str = "vertical"
    voice: str = DEFAULT_VOICE
    model: str = DEFAULT_IMAGE_MODEL


_jobs: dict[str, dict] = {}
_job_queue: asyncio.Queue = asyncio.Queue()


async def _job_worker() -> None:
    while True:
        job_id = await _job_queue.get()
        rec = _jobs[job_id]
        try:
            rec["status"] = "processing"
            workdir = JOBS_DIR / job_id
            workdir.mkdir(parents=True, exist_ok=True)
            kind = rec.get("kind", "story")
            if kind == "textvideo":
                await _run_textvideo_job(workdir, rec)
            elif kind == "animate":
                await _run_animate_job(workdir, rec)
            else:
                await _run_story_job(workdir, rec)
            rec["status"] = "done"
            rec["download_url"] = f"/api/job/{job_id}/download"
        except Exception as e:  # noqa: BLE001
            rec["status"] = "failed"
            rec["error"] = str(e)[:500]
        finally:
            _job_queue.task_done()


async def _run_story_job(workdir: Path, rec: dict) -> None:
    fmt, voice = rec["format"], rec["voice"]
    model = rec.get("model", DEFAULT_IMAGE_MODEL)
    iw, ih = (768, 1344) if fmt == "vertical" else (1280, 720)
    clips = []
    for i, sc in enumerate(rec["scenes"]):
        img = await fetch_image(sc["imagePrompt"], iw, ih, model)
        aud = await make_voice(sc["narration"], voice)
        clip = await _build_scene(workdir, i, img, aud, sc["narration"],
                                  fmt, zoom_in=(i % 2 == 0))
        clips.append(clip)
        rec["done"] = i + 1
    lst = workdir / "list.txt"
    lst.write_text("".join(f"file '{c.name}'\n" for c in clips))
    final = workdir / "output.mp4"
    await _run(["ffmpeg", "-y", "-f", "concat", "-safe", "0",
                "-i", str(lst), "-c", "copy", str(final)])


async def _run_textvideo_job(workdir: Path, rec: dict) -> None:
    fmt, style = rec["format"], rec["style"]
    model = rec.get("model", DEFAULT_IMAGE_MODEL)
    iw, ih = (768, 1344) if fmt == "vertical" else (1280, 720)
    img = await fetch_image(rec["prompt"], iw, ih, model)
    rec["done"] = 1
    await _build_motion_video(workdir, img, workdir / "output.mp4", fmt, style)


async def _run_animate_job(workdir: Path, rec: dict) -> None:
    fmt, style = rec["format"], rec["style"]
    img = Path(rec["upload_path"])
    if not img.exists():
        raise RuntimeError("Uploaded photo is missing — please try again.")
    # verify it's really an image before ffmpeg touches it
    from PIL import Image
    with Image.open(img) as im:
        im.verify()
    rec["done"] = 1
    await _build_motion_video(workdir, img, workdir / "output.mp4", fmt, style)


@asynccontextmanager
async def lifespan(app: FastAPI):
    workers = [asyncio.create_task(_job_worker())
               for _ in range(LIMITS["global_max_concurrent_jobs"])]
    yield
    for w in workers:
        w.cancel()


app = FastAPI(title="FreeAI Tools", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])


# ---------------------------------------------------------------- endpoints
class ImageIn(BaseModel):
    prompt: str = Field(min_length=1, max_length=LIMITS["image_prompt_max_chars"])
    width: int = 768
    height: int = 768
    model: str = DEFAULT_IMAGE_MODEL


class VoiceIn(BaseModel):
    text: str = Field(min_length=1, max_length=LIMITS["voice_text_max_chars"])
    voice: str = DEFAULT_VOICE


@app.get("/api/health")
async def health():
    return {"ok": True, "free": True}


@app.get("/api/config")
async def config():
    return {"voices": VOICES, "image_models": IMAGE_MODELS,
            "formats": {k: v["label"] for k, v in FORMATS.items()},
            "caption_platforms": CAPTION_PLATFORMS, "caption_tones": CAPTION_TONES,
            "quote_styles": QUOTE_STYLES, "video_styles": VIDEO_STYLES,
            "limits": {"image_prompt_max": LIMITS["image_prompt_max_chars"],
                       "voice_text_max": LIMITS["voice_text_max_chars"],
                       "story_max_scenes": LIMITS["story_max_scenes"],
                       "story_idea_topic_max": LIMITS["story_idea_topic_max_chars"],
                       "rembg_max_mb": LIMITS["rembg_max_mb"],
                       "quote_text_max": LIMITS["quote_text_max_chars"],
                       "caption_topic_max": LIMITS["caption_topic_max_chars"],
                       "text_video_prompt_max": LIMITS["text_video_prompt_max_chars"],
                       "animate_max_mb": LIMITS["animate_max_mb"]}}


@app.post("/api/image")
async def api_image(body: ImageIn, request: Request):
    check_limit(request, "image")
    check_banned(body.prompt)
    if body.model not in IMAGE_MODELS:
        raise HTTPException(400, f"Unknown image model. Choose from: {', '.join(IMAGE_MODELS)}")
    w = max(LIMITS["image_min_px"], min(LIMITS["image_max_px"], body.width))
    h = max(LIMITS["image_min_px"], min(LIMITS["image_max_px"], body.height))
    p = await fetch_image(body.prompt, w, h, body.model)
    media = {"jpg": "image/jpeg", "jpeg": "image/jpeg",
             "png": "image/png", "webp": "image/webp"}.get(p.suffix.lstrip("."), "image/jpeg")
    return FileResponse(p, media_type=media, filename=f"freeai-image.{p.suffix.lstrip('.')}")


@app.post("/api/voice")
async def api_voice(body: VoiceIn, request: Request):
    check_limit(request, "voice")
    if body.voice not in VOICES:
        raise HTTPException(400, f"Unknown voice. Choose from: {', '.join(VOICES)}")
    p = await make_voice(body.text.strip(), body.voice)
    return FileResponse(p, media_type="audio/mpeg", filename="freeai-voice.mp3")


@app.post("/api/story")
async def api_story(body: StoryIn, request: Request):
    check_limit(request, "video")
    if body.format not in FORMATS:
        raise HTTPException(400, "format must be 'vertical' or 'wide'")
    if body.voice not in VOICES:
        raise HTTPException(400, f"Unknown voice. Choose from: {', '.join(VOICES)}")
    if body.model not in IMAGE_MODELS:
        raise HTTPException(400, f"Unknown image model. Choose from: {', '.join(IMAGE_MODELS)}")
    for sc in body.scenes:
        check_banned(sc.imagePrompt)
        check_banned(sc.narration)
    job_id = uuid.uuid4().hex[:12]
    _jobs[job_id] = {"id": job_id, "status": "queued", "done": 0,
                     "total": len(body.scenes), "kind": "story",
                     "format": body.format, "voice": body.voice,
                     "model": body.model, "filename": "freeforge-story.mp4",
                     "scenes": [s.model_dump() for s in body.scenes],
                     "error": None, "download_url": None}
    await _job_queue.put(job_id)
    return {"job_id": job_id, "status": "queued", "total": len(body.scenes)}


@app.get("/api/job/{job_id}")
async def api_job(job_id: str):
    rec = _jobs.get(job_id)
    if not rec:
        raise HTTPException(404, "Unknown job id")
    return {"id": job_id, "status": rec["status"], "done": rec["done"],
            "total": rec["total"], "error": rec["error"],
            "download_url": rec["download_url"]}


@app.get("/api/job/{job_id}/download")
async def api_job_download(job_id: str):
    rec = _jobs.get(job_id)
    if not rec or rec["status"] != "done":
        raise HTTPException(404, "Video not ready yet")
    p = JOBS_DIR / job_id / "output.mp4"
    if not p.exists():
        raise HTTPException(404, "Video file missing")
    return FileResponse(p, media_type="video/mp4",
                        filename=rec.get("filename", "freeforge-video.mp4"))



# ---------------------------------------------------------------- AI story writer
TEXT_API = "https://text.pollinations.ai/openai"
_idea_lock = asyncio.Lock()
_last_idea_call = 0.0


class StoryIdeaIn(BaseModel):
    topic: str = Field(min_length=1, max_length=LIMITS["story_idea_topic_max_chars"])
    scenes: int = Field(default=3, ge=1, le=LIMITS["story_max_scenes"])


_IDEA_SYSTEM = (
    "You are a short-form video story writer. Reply with STRICT JSON only — "
    "no markdown fences, no explanation, no extra keys. Exact format:\n"
    '{"scenes":[{"narration":"...","imagePrompt":"..."}]}\n'
    "Rules: narration = what the voiceover says (1-2 short sentences, under 30 words). "
    "imagePrompt = a short photorealistic visual description of the scene "
    "(no text, no watermark, no people with deformed features). "
    "Make it emotional with a hook in scene 1."
)


def _extract_scenes(raw: str, want: int) -> list[dict]:
    """Pull strict JSON out of the model reply and validate scene dicts."""
    import json as _json
    import re as _re
    txt = raw.strip()
    # strip markdown fences if the model added them anyway
    m = _re.search(r"```(?:json)?\s*(\{.*?\})\s*```", txt, _re.S)
    if m:
        txt = m.group(1)
    # fall back to the outermost {...} span
    if not txt.startswith("{"):
        s, e = txt.find("{"), txt.rfind("}")
        if s != -1 and e != -1 and e > s:
            txt = txt[s:e + 1]
    data = _json.loads(txt)
    scenes = data.get("scenes") if isinstance(data, dict) else None
    if not isinstance(scenes, list) or not scenes:
        raise ValueError("no scenes in reply")
    out = []
    for sc in scenes[:want]:
        if not isinstance(sc, dict):
            continue
        narr = str(sc.get("narration", "")).strip()[:LIMITS["story_narration_max_chars"]]
        ip = str(sc.get("imagePrompt", "")).strip()[:LIMITS["story_image_prompt_max_chars"]]
        if narr and ip:
            out.append({"narration": narr, "imagePrompt": ip})
    if not out:
        raise ValueError("no usable scenes in reply")
    return out


@app.post("/api/story-idea")
async def api_story_idea(body: StoryIdeaIn, request: Request):
    """Generate a scene-by-scene story (narrations + image prompts) from a topic,
    via the keyless Pollinations text API. Serialized server-side to respect
    the upstream soft rate limit."""
    check_limit(request, "story_idea")
    check_banned(body.topic)
    user_prompt = (
        f'Write a {body.scenes}-scene micro story about: "{body.topic.strip()}". '
        f"Return exactly {body.scenes} scenes."
    )
    async with _idea_lock:
        global _last_idea_call
        wait = LIMITS["story_idea_min_interval_s"] - (time.monotonic() - _last_idea_call)
        if wait > 0:
            await asyncio.sleep(wait)
        try:
            async with httpx.AsyncClient(headers=UA, timeout=150) as c:
                r = await c.post(TEXT_API, json={
                    "model": "openai",
                    "messages": [
                        {"role": "system", "content": _IDEA_SYSTEM},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 900,
                })
            _last_idea_call = time.monotonic()
        except Exception:
            _last_idea_call = time.monotonic()
            raise HTTPException(502, "AI writer is busy right now — please type your story manually or try again in a moment.")
    if r.status_code != 200:
        raise HTTPException(502, "AI writer is busy right now — please type your story manually or try again in a moment.")
    try:
        content = r.json()["choices"][0]["message"]["content"]
        scenes = _extract_scenes(content, body.scenes)
    except Exception:
        raise HTTPException(502, "AI writer gave an unreadable reply — please type your story manually or try again.")
    for sc in scenes:
        check_banned(sc["narration"])
        check_banned(sc["imagePrompt"])
    return {"topic": body.topic.strip(), "scenes": scenes}




# ---------------------------------------------------------------- background remover
from fastapi import File, UploadFile, Form
from fastapi.responses import Response as _Response

REMBG_DIR = DATA_DIR / "rembg"
REMBG_DIR.mkdir(parents=True, exist_ok=True)
REMBG_TYPES = {"image/jpeg", "image/png", "image/webp"}


def _rembg_sync(data: bytes) -> bytes:
    """CPU-bound background removal. Lazy import so the app boots even if
    rembg isn't installed; the endpoint then returns 503.
    Pins the u2net model (pre-downloaded at build time) — the rembg default
    model would trigger a fresh ~170MB download on first request."""
    from rembg import new_session, remove
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(data))
    out = remove(img, session=new_session("u2net"))
    buf = io.BytesIO()
    out.save(buf, format="PNG")
    return buf.getvalue()


@app.post("/api/remove-bg")
async def api_remove_bg(request: Request, file: UploadFile = File(...)):
    """Remove the background from an uploaded photo (self-hosted rembg).
    Returns PNG with transparency."""
    check_limit(request, "rembg")
    ctype = (file.content_type or "").split(";")[0].strip().lower()
    if ctype not in REMBG_TYPES:
        raise HTTPException(400, "Please upload a JPG, PNG or WebP image.")
    data = await file.read()
    max_bytes = LIMITS["rembg_max_mb"] * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(400, f"Image too large — max {LIMITS['rembg_max_mb']}MB.")
    if len(data) < 100:
        raise HTTPException(400, "Uploaded file looks empty.")
    try:
        png = await asyncio.to_thread(_rembg_sync, data)
    except ImportError:
        raise HTTPException(503, "Background remover is temporarily unavailable.")
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Could not process that image: {str(e)[:200]}")
    return _Response(content=png, media_type="image/png",
                     headers={"Content-Disposition": 'attachment; filename="freeforge-nobg.png"'})


# ---------------------------------------------------------------- caption & hashtag generator
from limits import CAPTION_PLATFORMS, CAPTION_TONES

_caption_lock = asyncio.Lock()
_last_caption_call = 0.0


class CaptionIn(BaseModel):
    topic: str = Field(min_length=1, max_length=LIMITS["caption_topic_max_chars"])
    platform: str = "reels"
    tone: str = "funny"


_CAPTION_SYSTEM = (
    "You are a social-media caption writer for short-form creators. "
    "Reply with STRICT JSON only — no markdown fences, no explanation, no extra keys. "
    'Template: {"captions":["cap1","cap2","cap3"],'
    '"hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5","#tag6","#tag7","#tag8","#tag9","#tag10"]}\n'
    "HARD RULES — count before replying: the captions array MUST contain exactly 3 items "
    "(each under 150 characters, punchy, 1-2 emojis); the hashtags array MUST contain "
    "exactly 10 items (single words or camelCase, no spaces, mix of broad and niche tags, "
    "no duplicates). Match the requested platform and tone."
)
_CAPTION_RETRY_NOTE = (
    "Your last reply had the wrong counts. Try again and this time return EXACTLY "
    "3 captions and EXACTLY 10 hashtags — no more, no fewer."
)


def _extract_caption(raw: str) -> dict:
    import json as _json
    import re as _re
    txt = raw.strip()
    m = _re.search(r"```(?:json)?\s*(\{.*?\})\s*```", txt, _re.S)
    if m:
        txt = m.group(1)
    if not txt.startswith("{"):
        s, e = txt.find("{"), txt.rfind("}")
        if s != -1 and e != -1 and e > s:
            txt = txt[s:e + 1]
    data = _json.loads(txt)
    if not isinstance(data, dict):
        raise ValueError("bad reply")
    caps = [str(c).strip()[:150] for c in data.get("captions", []) if str(c).strip()]
    tags = [str(t).strip() for t in data.get("hashtags", []) if str(t).strip()]
    tags = [t if t.startswith("#") else f"#{t}" for t in tags]
    # de-dupe hashtags, keep order
    seen: set = set()
    tags = [t for t in tags if not (t.lower() in seen or seen.add(t.lower()))]
    if len(caps) < 3 or len(tags) < 10:
        raise ValueError("incomplete reply")
    return {"captions": caps[:3], "hashtags": tags[:10]}


@app.post("/api/caption")
async def api_caption(body: CaptionIn, request: Request):
    """Generate 3 captions + 10 hashtags for Reels/TikTok/YouTube/Facebook
    via the keyless Pollinations text API."""
    check_limit(request, "caption")
    if body.platform not in CAPTION_PLATFORMS:
        raise HTTPException(400, f"platform must be one of: {', '.join(CAPTION_PLATFORMS)}")
    if body.tone not in CAPTION_TONES:
        raise HTTPException(400, f"tone must be one of: {', '.join(CAPTION_TONES)}")
    check_banned(body.topic)
    global _last_caption_call
    user_prompt = (
        f"Write captions + hashtags for {CAPTION_PLATFORMS[body.platform]} in a "
        f"{CAPTION_TONES[body.tone].lower()} tone, about: \"{body.topic.strip()}\"."
    )
    result = None
    async with _caption_lock:
        for attempt in range(2):  # one retry with a corrective note if counts are off
            wait = LIMITS["caption_min_interval_s"] - (time.monotonic() - _last_caption_call)
            if wait > 0:
                await asyncio.sleep(wait)
            messages = [
                {"role": "system", "content": _CAPTION_SYSTEM},
                {"role": "user", "content": user_prompt},
            ]
            if attempt == 1:
                messages.append({"role": "user", "content": _CAPTION_RETRY_NOTE})
            try:
                async with httpx.AsyncClient(headers=UA, timeout=150) as c:
                    r = await c.post(TEXT_API, json={
                        "model": "openai",
                        "messages": messages,
                        "max_tokens": 700,
                        "temperature": 0.3,
                    })
                _last_caption_call = time.monotonic()
            except Exception:
                _last_caption_call = time.monotonic()
                raise HTTPException(502, "Caption writer is busy right now — try again in a moment.")
            if r.status_code != 200:
                continue
            try:
                content = r.json()["choices"][0]["message"]["content"]
                result = _extract_caption(content)
                break
            except Exception:
                continue  # retry once; fall through to 502 below
    if result is None:
        raise HTTPException(502, "Caption writer gave an unreadable reply — try again.")
    for c in result["captions"]:
        check_banned(c)
    return result


# ---------------------------------------------------------------- AI chat
_chat_lock = asyncio.Lock()
_last_chat_call = 0.0


class AIChatIn(BaseModel):
    message: str = Field(min_length=1, max_length=LIMITS["ai_chat_message_max_chars"])
    history: list = Field(default_factory=list)


_CHAT_SYSTEM = (
    "You are FreeForge's friendly AI assistant. Answer helpfully, clearly and concisely. "
    "Keep replies under ~150 words unless the user asks for more. "
    "Never invent prices or accounts: everything on FreeForge is 100% free with no signup. "
    "Refuse sexual, violent, hateful or illegal requests briefly and politely."
)


@app.post("/api/ai-chat")
async def api_ai_chat(body: AIChatIn, request: Request):
    """Free AI chatbot via the keyless Pollinations text API.
    Session-only history (last ~6 messages) comes from the client."""
    check_limit(request, "ai_chat")
    check_banned(body.message)
    msgs = [{"role": "system", "content": _CHAT_SYSTEM}]
    for h in body.history[-6:]:
        if not isinstance(h, dict):
            continue
        role = "user" if h.get("role") != "assistant" else "assistant"
        content = str(h.get("content", "")).strip()[:LIMITS["ai_chat_message_max_chars"]]
        if content:
            msgs.append({"role": role, "content": content})
    msgs.append({"role": "user", "content": body.message.strip()})
    async with _chat_lock:
        global _last_chat_call
        wait = LIMITS["ai_chat_min_interval_s"] - (time.monotonic() - _last_chat_call)
        if wait > 0:
            await asyncio.sleep(wait)
        try:
            async with httpx.AsyncClient(headers=UA, timeout=150) as c:
                r = await c.post(TEXT_API, json={
                    "model": "openai",
                    "messages": msgs,
                    "max_tokens": 500,
                })
            _last_chat_call = time.monotonic()
        except Exception:
            _last_chat_call = time.monotonic()
            raise HTTPException(502, "AI chat is busy right now — please try again in a moment.")
    if r.status_code != 200:
        raise HTTPException(502, "AI chat is busy right now — please try again in a moment.")
    try:
        reply = r.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        raise HTTPException(502, "AI chat gave an unreadable reply — please try again.")
    if not reply:
        raise HTTPException(502, "AI chat gave an empty reply — please try again.")
    check_banned(reply)
    return {"reply": reply[:2000]}


# ---------------------------------------------------------------- quote / meme maker
from limits import QUOTE_STYLES

QUOTE_GRADIENTS = {
    "sunset": ((255, 126, 95), (254, 180, 123), (118, 75, 162)),
    "ocean": ((8, 47, 73), (14, 116, 144), (34, 211, 238)),
    "dark": ((10, 10, 18), (24, 24, 40), (40, 40, 64)),
    "neon": ((26, 6, 58), (88, 28, 135), (0, 212, 255)),
}


class QuoteIn(BaseModel):
    text: str = Field(min_length=1, max_length=LIMITS["quote_text_max_chars"])
    style: str = "sunset"


def _quote_sync(text: str, style: str) -> bytes:
    from PIL import Image, ImageDraw, ImageFont
    import io
    W = H = 1080
    stops = QUOTE_GRADIENTS[style]
    img = Image.new("RGB", (W, H))
    # vertical multi-stop gradient
    top, mid, bot = stops
    px = img.load()
    for y in range(H):
        t = y / (H - 1)
        if t < 0.5:
            a, b, k = top, mid, t * 2
        else:
            a, b, k = mid, bot, (t - 0.5) * 2
        px[0, y] = tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(3))
    # horizontal loop is O(n^2)-free: fill rows by pasting 1px-wide column
    for x in range(1, W):
        img.paste(img.crop((0, 0, 1, H)), (x, 0))
    d = ImageDraw.Draw(img)

    def font_at(size: int):
        if FONT_PATH:
            return ImageFont.truetype(FONT_PATH, size)
        return ImageFont.load_default()

    # shrink font until the wrapped text fits
    words = text.split()
    size = 96
    lines: list[str] = []
    while size >= 28:
        f = font_at(size)
        lines, cur = [], ""
        for w_ in words:
            trial = (cur + " " + w_).strip()
            if d.textlength(trial, font=f) <= W - 160:
                cur = trial
            else:
                lines.append(cur)
                cur = w_
        lines.append(cur)
        total_h = len(lines) * int(size * 1.35)
        if total_h <= H - 320:
            break
        size -= 6
    f = font_at(size)
    y = (H - len(lines) * int(size * 1.35)) // 2
    for ln in lines:
        lw = d.textlength(ln, font=f)
        x = (W - lw) // 2
        d.text((x + 3, y + 3), ln, font=f, fill=(0, 0, 0))          # shadow
        d.text((x, y), ln, font=f, fill=(255, 255, 255))
        y += int(size * 1.35)
    # subtle FreeForge credit line, bottom-right corner
    cf = font_at(30)
    credit = "FreeForge"
    cw = d.textlength(credit, font=cf)
    d.text((W - cw - 36, H - 76), credit, font=cf, fill=(235, 235, 245))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@app.post("/api/quote")
async def api_quote(body: QuoteIn, request: Request):
    """Render a 1080x1080 quote/meme card (pure local PIL)."""
    check_limit(request, "quote")
    if body.style not in QUOTE_STYLES:
        raise HTTPException(400, f"style must be one of: {', '.join(QUOTE_STYLES)}")
    check_banned(body.text)
    try:
        png = await asyncio.to_thread(_quote_sync, body.text.strip(), body.style)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(500, f"Could not render quote: {str(e)[:200]}")
    return _Response(content=png, media_type="image/png",
                     headers={"Content-Disposition": 'attachment; filename="freeforge-quote.png"'})


# ---------------------------------------------------------------- text to video
class TextVideoIn(BaseModel):
    prompt: str = Field(min_length=1, max_length=LIMITS["text_video_prompt_max_chars"])
    style: str = "zoom-in"
    orientation: str = "vertical"
    model: str = DEFAULT_IMAGE_MODEL


@app.post("/api/text-video")
async def api_text_video(body: TextVideoIn, request: Request):
    """Text to Video (motion-style): 1 prompt -> AI image -> 5s Ken Burns video.
    Queued like story videos; poll /api/job/{id}."""
    check_limit(request, "textvideo")
    check_banned(body.prompt)
    if body.style not in VIDEO_STYLES:
        raise HTTPException(400, f"Unknown video style. Choose from: {', '.join(VIDEO_STYLES)}")
    if body.orientation not in FORMATS:
        raise HTTPException(400, "orientation must be 'vertical' or 'wide'")
    if body.model not in IMAGE_MODELS:
        raise HTTPException(400, f"Unknown image model. Choose from: {', '.join(IMAGE_MODELS)}")
    job_id = uuid.uuid4().hex[:12]
    _jobs[job_id] = {"id": job_id, "status": "queued", "done": 0, "total": 2,
                     "kind": "textvideo",
                     "format": body.orientation, "style": body.style,
                     "model": body.model, "filename": "freeforge-text-video.mp4",
                     "prompt": body.prompt.strip(),
                     "error": None, "download_url": None}
    await _job_queue.put(job_id)
    return {"job_id": job_id, "status": "queued", "total": 2}


# ---------------------------------------------------------------- photo animator
ANIMATE_TYPES = {"image/jpeg", "image/png", "image/webp"}


@app.post("/api/animate-photo")
async def api_animate_photo(request: Request, file: UploadFile = File(...),
                            style: str = Form("zoom-in"),
                            orientation: str = Form("vertical")):
    """Photo Animator (motion-style): uploaded photo -> 5s Ken Burns video.
    Queued like story videos; poll /api/job/{id}."""
    check_limit(request, "animate")
    if style not in VIDEO_STYLES:
        raise HTTPException(400, f"Unknown video style. Choose from: {', '.join(VIDEO_STYLES)}")
    if orientation not in FORMATS:
        raise HTTPException(400, "orientation must be 'vertical' or 'wide'")
    ctype = (file.content_type or "").split(";")[0].strip().lower()
    if ctype not in ANIMATE_TYPES:
        raise HTTPException(400, "Please upload a JPG, PNG or WebP photo.")
    data = await file.read()
    max_bytes = LIMITS["animate_max_mb"] * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(400, f"Photo too large — max {LIMITS['animate_max_mb']}MB.")
    if len(data) < 100:
        raise HTTPException(400, "Uploaded file looks empty.")
    # verify it's really an image
    try:
        from PIL import Image
        import io
        with Image.open(io.BytesIO(data)) as im:
            im.verify()
    except Exception:
        raise HTTPException(400, "That file isn't a valid photo.")
    job_id = uuid.uuid4().hex[:12]
    workdir = JOBS_DIR / job_id
    workdir.mkdir(parents=True, exist_ok=True)
    ext = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}[ctype]
    upload_path = workdir / f"upload.{ext}"
    upload_path.write_bytes(data)
    _jobs[job_id] = {"id": job_id, "status": "queued", "done": 0, "total": 1,
                     "kind": "animate",
                     "format": orientation, "style": style,
                     "filename": "freeforge-animated-photo.mp4",
                     "upload_path": str(upload_path),
                     "error": None, "download_url": None}
    await _job_queue.put(job_id)
    return {"job_id": job_id, "status": "queued", "total": 1}


# ---------------------------------------------------------------- pdf tools
# Merge / split / compress PDFs with pypdf — pure local, no external service.

PDF_TYPES = {"application/pdf"}


def _read_pdf_upload(data: bytes, label: str):
    """Parse an uploaded PDF, enforcing size/page guards. Returns (reader, n_pages)."""
    from pypdf import PdfReader
    import io
    try:
        reader = PdfReader(io.BytesIO(data))
        n = len(reader.pages)
    except Exception:
        raise HTTPException(400, f"{label} isn't a valid PDF file.")
    if n < 1:
        raise HTTPException(400, f"{label} has no pages.")
    if n > LIMITS["pdf_max_pages"]:
        raise HTTPException(400, f"{label} has too many pages (max {LIMITS['pdf_max_pages']}).")
    return reader, n


async def _pdf_uploads(files: list, max_files: int) -> list[bytes]:
    """Read + validate uploaded PDF files. Shared by merge/split/compress."""
    if not files:
        raise HTTPException(400, "Please upload at least one PDF file.")
    if len(files) > max_files:
        raise HTTPException(400, f"Too many files — max {max_files} at once.")
    out = []
    for f in files:
        ctype = (f.content_type or "").split(";")[0].strip().lower()
        if ctype not in PDF_TYPES and not (f.filename or "").lower().endswith(".pdf"):
            raise HTTPException(400, f"'{f.filename or 'file'}' isn't a PDF.")
        data = await f.read()
        max_bytes = LIMITS["pdf_max_mb"] * 1024 * 1024
        if len(data) > max_bytes:
            raise HTTPException(400, f"'{f.filename or 'file'}' is too large — max {LIMITS['pdf_max_mb']}MB.")
        if len(data) < 100:
            raise HTTPException(400, f"'{f.filename or 'file'}' looks empty.")
        out.append(data)
    return out


def _pdf_merge_sync(datas: list[bytes]) -> bytes:
    from pypdf import PdfWriter
    import io
    writer = PdfWriter()
    for data in datas:
        reader, _ = _read_pdf_upload(data, "One of the PDFs")
        for page in reader.pages:
            writer.add_page(page)
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def _parse_ranges(spec: str, n_pages: int) -> list[int]:
    """Parse '1-3,5' style page spec (1-indexed) into 0-indexed page numbers."""
    pages: list[int] = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            try:
                start, end = int(a.strip()), int(b.strip())
            except ValueError:
                raise HTTPException(400, f"Bad page range '{part}' — use formats like 1-3,5.")
            if start < 1 or end < start or end > n_pages:
                raise HTTPException(400,
                    f"Page range '{part}' is out of bounds (this PDF has {n_pages} pages).")
            pages.extend(range(start - 1, end))
        else:
            try:
                p = int(part)
            except ValueError:
                raise HTTPException(400, f"Bad page number '{part}'.")
            if p < 1 or p > n_pages:
                raise HTTPException(400,
                    f"Page {p} is out of bounds (this PDF has {n_pages} pages).")
            pages.append(p - 1)
    if not pages:
        raise HTTPException(400, "No pages selected — use formats like 1-3,5.")
    if len(pages) > LIMITS["pdf_max_pages"]:
        raise HTTPException(400, f"Too many pages selected (max {LIMITS['pdf_max_pages']}).")
    return pages


def _pdf_split_sync(data: bytes, spec: str) -> tuple[bytes, int]:
    from pypdf import PdfWriter
    import io
    reader, n = _read_pdf_upload(data, "The PDF")
    pages = _parse_ranges(spec, n)
    writer = PdfWriter()
    for i in pages:
        writer.add_page(reader.pages[i])
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue(), len(pages)


def _pdf_compress_sync(data: bytes) -> tuple[bytes, int, int]:
    from pypdf import PdfWriter
    import io
    reader, n = _read_pdf_upload(data, "The PDF")
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)
    # compress AFTER attaching to the writer (pypdf requires this)
    for page in writer.pages:
        page.compress_content_streams()
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue(), n, len(data)


@app.post("/api/pdf-merge")
async def api_pdf_merge(request: Request, files: list[UploadFile] = File(...)):
    """Merge 2-10 uploaded PDFs into one (pages kept in upload order)."""
    check_limit(request, "pdf")
    datas = await _pdf_uploads(files, LIMITS["pdf_max_files"])
    if len(datas) < 2:
        raise HTTPException(400, "Upload at least 2 PDFs to merge.")
    try:
        merged = await asyncio.to_thread(_pdf_merge_sync, datas)
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Could not merge those PDFs: {str(e)[:200]}")
    return _Response(content=merged, media_type="application/pdf",
                     headers={"Content-Disposition": 'attachment; filename="freeforge-merged.pdf"'})


@app.post("/api/pdf-split")
async def api_pdf_split(request: Request, file: UploadFile = File(...),
                        pages: str = Form(...)):
    """Extract page ranges (e.g. '1-3,5') from an uploaded PDF into a new PDF."""
    check_limit(request, "pdf")
    datas = await _pdf_uploads([file], 1)
    spec = (pages or "").strip()[:100]
    if not spec:
        raise HTTPException(400, "Tell us which pages to keep — e.g. 1-3,5.")
    try:
        out, count = await asyncio.to_thread(_pdf_split_sync, datas[0], spec)
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Could not split that PDF: {str(e)[:200]}")
    return _Response(content=out, media_type="application/pdf",
                     headers={"Content-Disposition": 'attachment; filename="freeforge-split.pdf"',
                              "X-Pages": str(count)})


@app.post("/api/pdf-compress")
async def api_pdf_compress(request: Request, file: UploadFile = File(...)):
    """Reduce a PDF's file size (lossless content-stream compression)."""
    check_limit(request, "pdf")
    datas = await _pdf_uploads([file], 1)
    try:
        out, n_pages, orig = await asyncio.to_thread(_pdf_compress_sync, datas[0])
    except HTTPException:
        raise
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Could not compress that PDF: {str(e)[:200]}")
    return _Response(content=out, media_type="application/pdf",
                     headers={"Content-Disposition": 'attachment; filename="freeforge-compressed.pdf"',
                              "X-Original-Bytes": str(orig),
                              "X-Compressed-Bytes": str(len(out))})


# ---------------------------------------------------------------- image compressor / resizer
COMPRESS_TYPES = {"image/jpeg", "image/png", "image/webp"}
COMPRESS_FORMATS = {"jpeg": "JPEG", "png": "PNG", "webp": "WEBP"}


def _compress_image_sync(data: bytes, max_width: int, quality: int, fmt: str) -> tuple[bytes, int, int, int, int]:
    from PIL import Image
    import io
    with Image.open(io.BytesIO(data)) as im:
        orig_w, orig_h = im.size
        if max(orig_w, orig_h) <= 0:
            raise ValueError("invalid image dimensions")
        img = im
        # resize only if wider than requested (keep aspect ratio)
        if orig_w > max_width:
            new_h = round(orig_h * max_width / orig_w)
            img = im.resize((max_width, new_h), Image.LANCZOS)
        if fmt in ("jpeg", "webp") and img.mode in ("RGBA", "LA", "PA"):
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img, mask=img.split()[-1])
            img = bg
        elif fmt == "jpeg" and img.mode != "RGB":
            img = img.convert("RGB")
        buf = io.BytesIO()
        save_kw = {"format": COMPRESS_FORMATS[fmt], "optimize": True}
        if fmt in ("jpeg", "webp"):
            save_kw["quality"] = quality
        img.save(buf, **save_kw)
        w, h = img.size
        return buf.getvalue(), orig_w, orig_h, w, h


@app.post("/api/compress-image")
async def api_compress_image(request: Request, file: UploadFile = File(...),
                             max_width: int = Form(1600),
                             quality: int = Form(80),
                             format: str = Form("jpeg")):
    """Shrink + recompress an uploaded image (JPG/PNG/WebP output)."""
    check_limit(request, "imgcompress")
    fmt = (format or "").strip().lower()
    if fmt not in COMPRESS_FORMATS:
        raise HTTPException(400, "format must be jpeg, png or webp")
    max_width = max(16, min(4096, max_width))
    quality = max(10, min(100, quality))
    ctype = (file.content_type or "").split(";")[0].strip().lower()
    if ctype not in COMPRESS_TYPES:
        raise HTTPException(400, "Please upload a JPG, PNG or WebP image.")
    data = await file.read()
    max_bytes = LIMITS["imgcompress_max_mb"] * 1024 * 1024
    if len(data) > max_bytes:
        raise HTTPException(400, f"Image too large — max {LIMITS['imgcompress_max_mb']}MB.")
    if len(data) < 100:
        raise HTTPException(400, "Uploaded file looks empty.")
    try:
        out, ow, oh, nw, nh = await asyncio.to_thread(
            _compress_image_sync, data, max_width, quality, fmt)
    except Exception as e:  # noqa: BLE001
        raise HTTPException(400, f"Could not compress that image: {str(e)[:200]}")
    media = {"jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}[fmt]
    return _Response(content=out, media_type=media,
                     headers={"Content-Disposition": f'attachment; filename="freeforge-compressed.{fmt}"',
                              "X-Original": f"{ow}x{oh}",
                              "X-Result": f"{nw}x{nh}",
                              "X-Original-Bytes": str(len(data)),
                              "X-Compressed-Bytes": str(len(out))})


# ---------------------------------------------------------------- client-side tools
# Password / anagram / QR generators run entirely in the browser. These
# endpoints exist only so the backend counts fair-use quota (anti-abuse).
@app.post("/api/password-quota")
async def api_password_quota(request: Request):
    check_limit(request, "password")
    return {"ok": True}


@app.post("/api/anagram-quota")
async def api_anagram_quota(request: Request):
    check_limit(request, "anagram")
    return {"ok": True}


@app.post("/api/qr-quota")
async def api_qr_quota(request: Request):
    check_limit(request, "qr")
    return {"ok": True}


@app.get("/api/my-ip")
async def api_my_ip(request: Request):
    check_limit(request, "myip")
    return {"ip": client_ip(request),
            "user_agent": request.headers.get("user-agent", "")[:300]}


# ---------------------------------------------------------------- content pages
# Blog / legal pages served as clean routes (AdSense-approval-ready content).
from fastapi.responses import HTMLResponse, PlainTextResponse, Response

PAGES_DIR = FRONTEND_DIR / "pages"
BLOG_POSTS = [
    ("how-to-make-free-ai-story-videos",
     "How to Make Free AI Story Videos (No Signup)"),
    ("free-ai-image-generator-guide",
     "Free AI Image Generator: A Beginner's Guide"),
    ("best-free-text-to-speech-voices",
     "Best Free Text-to-Speech Voices for Creators"),
    ("how-to-write-ai-prompts-that-work",
     "How to Write AI Prompts That Actually Work"),
    ("how-to-compress-pdf-free",
     "How to Compress a PDF for Free (Without Making It Look Terrible)"),
    ("password-security-guide",
     "Password Security Guide: The 7 Habits That Actually Keep Your Accounts Safe"),
    ("free-ai-tools-without-signup",
     "Free AI Tools Without Signup: What to Expect (and What's Too Good to Be True)"),
]


def _page(name: str) -> HTMLResponse:
    p = PAGES_DIR / name
    if not p.exists():
        raise HTTPException(404, "Page not found")
    return HTMLResponse(p.read_text(encoding="utf-8"))


@app.get("/privacy")
async def page_privacy():
    return _page("privacy.html")


@app.get("/about")
async def page_about():
    return _page("about.html")


@app.get("/contact")
async def page_contact():
    return _page("contact.html")


@app.get("/terms")
async def page_terms():
    return _page("terms.html")


@app.get("/blog")
async def page_blog():
    return _page("blog/index.html")


@app.get("/blog/{slug}")
async def page_blog_post(slug: str):
    if slug not in {s for s, _ in BLOG_POSTS}:
        raise HTTPException(404, "Post not found")
    return _page(f"blog/{slug}.html")


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots():
    return "User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n"


@app.get("/sitemap.xml")
async def sitemap():
    urls = ["/", "/#t-image", "/#t-aichat", "/#t-voice", "/#t-story",
            "/#t-rembg", "/#t-caption", "/#t-quote",
            "/#t-textvideo", "/#t-animate",
            "/#t-age", "/#t-bmi", "/#t-emi", "/#t-pdf",
            "/#t-compress", "/#t-unit", "/#t-words", "/#t-quiz",
            "/#t-password", "/#t-anagram", "/#t-qr", "/#t-myip",
            "/blog", "/privacy", "/about", "/contact", "/terms"]
    urls += [f"/blog/{s}" for s, _ in BLOG_POSTS]
    today = time.strftime("%Y-%m-%d")
    # locs must be absolute URLs (sitemap spec) — prefixed with SITE_URL
    body = ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + "".join(f"  <url><loc>{SITE_URL}{u}</loc><lastmod>{today}</lastmod></url>\n"
                      for u in urls)
            + "</urlset>")
    return Response(content=body, media_type="application/xml")


# frontend (also deployable standalone on Vercel/Netlify)
if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIR), html=True), name="frontend")
