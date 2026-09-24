#!/bin/bash
# Start/stop the FreeAI Tools backend.
# Usage: ./run.sh start | stop | restart | status
cd "$(dirname "$0")"
case "$1" in
  start)
    if [ -f server.pid ] && kill -0 "$(cat server.pid)" 2>/dev/null; then
      echo "already running (pid $(cat server.pid))"
    else
      nohup .venv/bin/python -m uvicorn app:app --host 127.0.0.1 --port 8000 > server.log 2>&1 &
      echo $! > server.pid
      sleep 4
      curl -s http://127.0.0.1:8000/api/health && echo " <- server up"
    fi
    ;;
  stop)
    [ -f server.pid ] && kill "$(cat server.pid)" 2>/dev/null && echo "stopped"
    rm -f server.pid
    ;;
  restart) "$0" stop; sleep 2; "$0" start ;;
  status) curl -s -m 3 http://127.0.0.1:8000/api/health || echo "down" ;;
  *) echo "usage: $0 start|stop|restart|status" ;;
esac
