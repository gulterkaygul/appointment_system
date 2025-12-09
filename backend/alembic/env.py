import sys
import os

# =============================
#  PYTHON PATH AYARLARI
# =============================
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")
APP_DIR = os.path.join(BACKEND_DIR, "app")

sys.path.append(ROOT_DIR)
sys.path.append(BACKEND_DIR)
sys.path.append(APP_DIR)

print("🟢 PATHS LOADED:", sys.path)

# =============================
#  ALEMBIC IMPORTS
# =============================
from alembic import context
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool

config = context.config

# Logging ayarları
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# =============================
#  SQLALCHEMY BASE & MODELLER
# =============================
from app.database import Base
from app.config import DATABASE_URL

# Modeller burada yükleniyor
import app.models  

# MODELLER YÜKLENDİKTEN SONRA METADATA ALINMALI
target_metadata = Base.metadata  

config.set_main_option("sqlalchemy.url", DATABASE_URL)


# =============================
#  OFFLINE MIGRATIONS
# =============================
def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,             # <-- SCHEMA DESTEK
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# =============================
#  ONLINE MIGRATIONS
# =============================
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
            include_schemas=True,          # <-- SCHEMA DESTEK
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


# =============================
#  MIGRATION MODE CHOICE
# =============================
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
