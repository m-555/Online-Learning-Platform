#!/bin/sh
set -e

# Apply database migrations, then load demo data (idempotent), then serve.
alembic upgrade head
python -m app.db.seed
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
