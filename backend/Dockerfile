# FastAPI + Playwright (Chromium) para scraping em produção.
# Build: docker build -f Dockerfile .
# Run local: docker run --env-file .env -p 8000:8000 <image>
# Render (e outros PaaS) injetam PORT; se ausente, usa-se 8000.

FROM python:3.11-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && playwright install --with-deps chromium

COPY . .

EXPOSE 8000

# shell form: PORT vem do ambiente (Render default ~10000); local sem PORT → 8000
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
