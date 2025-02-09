from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import pool
from alembic import context
from app.core.config import config as app_config
from app.models.base import Base

# Lấy config từ alembic.ini
config = context.config
config.set_main_option("sqlalchemy.url", app_config.get_db_url())

# Thiết lập logging
if config.config_file_name:
    fileConfig(config.config_file_name)

# Chỉ định metadata của các model để Alembic sử dụng
target_metadata = Base.metadata

def run_migrations_offline():
    """Chạy migration ở chế độ offline."""
    context.configure(
        url=config.get_main_option("sqlalchemy.url"),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    """Chạy migration ở chế độ online với async engine."""
    async_engine = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )
    async with async_engine.connect() as connection:
        await connection.run_sync(run_sync_migrations)

def run_sync_migrations(connection):
    """Cấu hình và chạy migration trong chế độ đồng bộ."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

# Chọn chế độ chạy phù hợp
if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())
