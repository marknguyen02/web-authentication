from fastapi import Request
from app.core.database import async_session
from app.utils.token import verify_token


async def get_db():
    """Lấy session kết nối cơ sở dữ liệu"""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def get_current_user(request: Request) -> str:
    access_token = request.cookies.get('access_token')
    payload = verify_token(access_token)
    user_id: str = payload.get("sub")
    return user_id

