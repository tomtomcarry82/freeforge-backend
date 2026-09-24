#!/bin/bash
# FreeAI Tools — health check, run every 5 minutes via cron.
# Restarts the backend via run.sh if /api/health is not OK. Logs every action.
SITE_DIR="/home/hatch/workspace/free-ai-tools-site"
LOG="$SITE_DIR/healthcheck.log"
TS="$(date '+%Y-%m-%d %H:%M:%S %z')"

if curl -sf -m 10 http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
  echo "[$TS] ok" >> "$LOG"
else
  echo "[$TS] DOWN — restarting" >> "$LOG"
  "$SITE_DIR/run.sh" restart >> "$LOG" 2>&1
  sleep 5
  if curl -sf -m 10 http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
    echo "[$TS] restarted — ok" >> "$LOG"
  else
    echo "[$TS] restarted — STILL DOWN" >> "$LOG"
  fi
fi
# keep the log from growing forever (last ~2000 lines)
tail -n 2000 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
