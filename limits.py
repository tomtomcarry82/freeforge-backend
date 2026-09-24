"""
All abuse/rate limits live HERE and only here.
Tightening later = changing one number in this file.

FREE-FIRST strategy: no login at launch. Limits are deliberately generous
so a normal human never feels them; they only stop bots/scripts.
"""

LIMITS = {
    # ---- per-IP daily quotas (token bucket: refills gradually over 24h) ----
    "image_per_day_per_ip": 60,
    "voice_per_day_per_ip": 20,
    "video_per_day_per_ip": 5,

    # ---- input size caps ----
    "image_prompt_max_chars": 500,
    "image_min_px": 256,
    "image_max_px": 2048,
    "voice_text_max_chars": 2000,
    "story_max_scenes": 8,
    "story_narration_max_chars": 600,   # per scene
    "story_image_prompt_max_chars": 500,  # per scene

    # ---- backend protection ----
    "global_max_concurrent_jobs": 2,   # max parallel ffmpeg story renders
    "upstream_image_min_interval_s": 5,  # respect Pollinations soft limit (~1 img / 5s)

    # ---- AI story writer (text.pollinations.ai, keyless) ----
    "story_idea_per_day_per_ip": 20,
    "story_idea_min_interval_s": 10,  # upstream text soft limit (~1 req / 5-15s)
    "story_idea_topic_max_chars": 200,

    # ---- background remover (rembg, self-hosted) ----
    "rembg_per_day_per_ip": 10,
    "rembg_max_mb": 10,

    # ---- caption & hashtag generator (text.pollinations.ai, keyless) ----
    "caption_per_day_per_ip": 20,
    "caption_min_interval_s": 10,
    "caption_topic_max_chars": 200,

    # ---- AI chat (text.pollinations.ai, keyless) ----
    "ai_chat_per_day_per_ip": 20,
    "ai_chat_min_interval_s": 10,
    "ai_chat_message_max_chars": 1000,

    # ---- quote/meme maker (PIL, pure local) ----
    "quote_per_day_per_ip": 30,
    "quote_text_max_chars": 300,

    # ---- text to video (motion-style: AI image + Ken Burns) ----
    "textvideo_per_day_per_ip": 5,
    "text_video_prompt_max_chars": 300,
    "motion_video_seconds": 5,

    # ---- photo animator (motion-style: uploaded photo + Ken Burns) ----
    "animate_per_day_per_ip": 5,
    "animate_max_mb": 10,

    # ---- pdf tools (pypdf, pure local) ----
    "pdf_per_day_per_ip": 20,
    "pdf_max_mb": 25,
    "pdf_max_files": 10,
    "pdf_max_pages": 500,

    # ---- image compressor/resizer (PIL, pure local) ----
    "imgcompress_per_day_per_ip": 30,
    "imgcompress_max_mb": 15,

    # ---- password / anagram / qr generators (pure client-side; quota is anti-abuse only) ----
    "password_per_day_per_ip": 30,
    "anagram_per_day_per_ip": 30,
    "qr_per_day_per_ip": 30,

    # ---- what-is-my-ip (tiny GET, quota is anti-abuse only) ----
    "myip_per_day_per_ip": 60,

    # ---- story video look ----
    "video_fps": 30,
    "bg_tone_volume": 0.04,  # very low ambient tone under narration
    "bg_tone_enabled": True,
}

# Short, editable denylist for prompts (image + story). Case-insensitive substring match.
BANNED_WORDS = [
    "porn", "xxx", "hentai", "nude", "naked", "erotic",
    "rape", "gore", "beheading", "bestiality",
]

# Image models offered in the UI (Pollinations keyless endpoint).
# Tested 2026-09-24 WITHOUT any key: only the default pipeline works —
# model=flux returns byte-identical output to no model param (flux IS the default),
# model=turbo returns HTTP 200 with an empty body, model=kontext/seedream return
# HTTP 500. So there is exactly one working keyless model. Kept as a dict so
# more can be added the moment another keyless model is verified.
IMAGE_MODELS = {
    "flux": "FLUX — best quality (free)",
}
DEFAULT_IMAGE_MODEL = "flux"

# Voices offered in the UI. edge-tts voice ids (Microsoft Edge TTS, free, no key).
# All 8 verified working 2026-09-24 via direct synthesis test.
VOICES = {    "en-US-AvaNeural": "English (US) — Ava (female)",
    "en-US-AndrewNeural": "English (US) — Andrew (male)",
    "en-GB-SoniaNeural": "English (UK) — Sonia (female)",
    "en-GB-RyanNeural": "English (UK) — Ryan (male)",
    "bn-IN-TanishaaNeural": "Bengali — Tanishaa (female)",
    "bn-BD-NabanitaNeural": "Bengali (BD) — Nabanita (female)",
    "hi-IN-SwaraNeural": "Hindi — Swara (female)",
    "hi-IN-MadhurNeural": "Hindi — Madhur (male)",
}
DEFAULT_VOICE = "en-US-AvaNeural"

# Story video formats: (width, height, label)
FORMATS = {
    "vertical": {"w": 1080, "h": 1920, "label": "Vertical 9:16 (Shorts/Reels/TikTok)"},
    "wide": {"w": 1920, "h": 1080, "label": "Wide 16:9 (YouTube)"},
}

# Caption generator options (creator platforms + tones for Reels/TikTok/YouTube).
CAPTION_PLATFORMS = {
    "reels": "Instagram Reels",
    "tiktok": "TikTok",
    "youtube": "YouTube Shorts",
    "facebook": "Facebook",
}
CAPTION_TONES = {
    "funny": "Funny",
    "professional": "Professional",
    "inspirational": "Inspirational",
}

# Quote/meme maker gradient styles (pure local PIL render).
QUOTE_STYLES = {
    "sunset": "Sunset",
    "ocean": "Ocean",
    "dark": "Dark",
    "neon": "Neon",
}

# "Video style" picker for the motion-style video tools (Text to Video,
# Photo Animator). These are Ken Burns-style camera moves applied with ffmpeg —
# NOT generative AI video models. Labels must stay plain words; never present
# them as AI models like Seedance/Veo/Muse.
VIDEO_STYLES = {
    "zoom-in": "Zoom in",
    "pan-right": "Pan right",
    "kenburns-mix": "Cinematic mix",
}
