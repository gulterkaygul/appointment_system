import os
import sys
from alembic import context
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool

# --------------------------------------------------
# PATH FIX — backend/app dosyalarının bulunabilmesi
# --------------------------------------------------

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
APP_DIR = os.path.join(BACKEND_DIR, "app")

sys.path.append(ROOT_DIR)
sys.path.append(BACKEND_DIR)
sys.path.append(APP_DIR)

print("🟢 PATHS LOADED:", sys.path)

# --------------------------------------------------
# ALEMBIC CONFIG
# --------------------------------------------------
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --------------------------------------------------
# SQLALCHEMY BASE & MODELS IMPORT
# --------------------------------------------------
from backend.app.database import Base
from backend.app.config import DATABASE_URL

# Modelleri yüklemeden migration çalışmaz
import backend.app.models

target_metadata = Base.metadata
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# --------------------------------------------------
# OFFLINE MIGRATIONS
# --------------------------------------------------
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
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
            compare_type=True,
            include_schemas=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# --------------------------------------------------
# RUN MIGRATIONS
# --------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
