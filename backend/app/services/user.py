from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.utils.hashing import hash_string, verify_string
from uuid import uuid4

async def add_user_to_db(request: RegisterRequest, db: AsyncSession):
    user_info = await db.execute(select(User).filter(User.username == request.username))
    existing_user = user_info.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username has already been taken."
        )

    new_user = User(
        user_id=str(uuid4()),
        username=request.username,
        password=hash_string(request.password),
        full_name=request.full_name
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)


async def authenticate_user(username: str, password: str, db: AsyncSession):
    result = await db.execute(select(User).filter(User.username == username))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_string(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return user.user_id

async def get_info_by_user_id(user_id: str, db: AsyncSession):
    result = await db.execute(select(User).filter(User.user_id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user.role, user.full_name

    


