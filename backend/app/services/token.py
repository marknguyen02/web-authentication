from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.token import RefreshToken


async def get_refresh_token(jti: str, db: AsyncSession) -> RefreshToken:
    """Hàm helper để tìm refresh token dựa trên JTI"""
    query = await db.execute(select(RefreshToken).filter(RefreshToken.jti == jti))
    existing_refresh_token = query.scalar_one_or_none()

    if not existing_refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is invalid or does not exist"
        )

    return existing_refresh_token


async def revoke_refresh_token(jti: str, db: AsyncSession):
    """Thu hồi refresh token cụ thể"""
    refresh_token = await get_refresh_token(jti, db)

    refresh_token.revoked = True
    await db.commit()


async def check_revoked_refresh_token(jti: str, db: AsyncSession):
    refresh_token = await get_refresh_token(jti, db)
    return refresh_token.revoked



async def revoke_all_refresh_tokens(sub: str, db: AsyncSession):
    """Thu hồi tất cả refresh tokens của người dùng"""
    query = await db.execute(select(RefreshToken).filter(RefreshToken.sub == sub))
    existing_refresh_tokens = query.scalars().all()

    if not existing_refresh_tokens:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No refresh tokens found for the user"
        )

    for token in existing_refresh_tokens:
        if not token.revoked:
            token.revoked = True

    await db.commit()


async def add_refresh_token_to_db(json_token_id: str, user_id: str, user_agent: str, ip_address: str, db: AsyncSession):
    """Thêm refresh token vào cơ sở dữ liệu"""
    new_refresh_token = RefreshToken(
        jti=json_token_id,
        sub=user_id,
        user_agent=user_agent,
        ip_address=ip_address
    )
    
    db.add(new_refresh_token)
    await db.commit()
    await db.refresh(new_refresh_token)
