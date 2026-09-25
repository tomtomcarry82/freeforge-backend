# FreeForge — free AI tools backend (FastAPI)
FROM python:3.11-slim

# ffmpeg binary needed by video/audio tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# only what the app needs to run
COPY app.py limits.py ./
COPY frontend ./frontend

ENV DATA_DIR=/tmp/freeai-data
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
