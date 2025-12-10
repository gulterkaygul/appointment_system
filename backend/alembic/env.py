import os
import sys
import importlib

# PYTHON CACHE RESET
importlib.invalidate_caches()

from alembic import context
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool

# --------------------------------------------------
# PATH FIX — PROJECT ROOT → BACKEND → APP
# --------------------------------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
APP_DIR = os.path.join(BACKEND_DIR, "app")

sys.path.append(ROOT_DIR)
sys.path.append(BACKEND_DIR)
sys.path.append(APP_DIR)

# DEBUG
print("🟢 PATH LOADED:", sys.path)

# Read alembic.ini
config = context.config

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --------------------------------------------------
# IMPORT MODELS & METADATA
# --------------------------------------------------
try:
    from backend.app.database import Base
    import backend.app.models
    from backend.app.config import DATABASE_URL
except Exception as e:
    print("🔥 MODEL LOAD ERROR:", e)
    raise

# METADATA → Alembic needs this!
target_metadata = Base.metadata

# DB connection
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# --------------------------------------------------
# OFFLINE MIGRATIONS
# --------------------------------------------------
def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        include_schemas=True,
    )

    with context.begin_transaction():
        context.run_migrations()

# --------------------------------------------------
# ONLINE MIGRATIONS
# --------------------------------------------------
def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()

# --------------------------------------------------
# RUN MODE
# --------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
