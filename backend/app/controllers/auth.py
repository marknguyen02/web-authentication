from fastapi import APIRouter, HTTPException, Depends, Response, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.user import add_user_to_db, authenticate_user
from app.services.token import add_refresh_token_to_db, check_revoked_refresh_token, revoke_refresh_token, revoke_all_refresh_tokens
from app.core.dependencies import get_db
from app.utils.token import verify_token, create_access_token, create_refresh_token

router = APIRouter()

@router.post("/register")
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    await add_user_to_db(request, db)
    return {"message": "Register successfully."}

@router.post("/login")
async def login(request: Request, response: Response, form_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    user_id= await authenticate_user(form_data.username, form_data.password, db)
    access_token, refresh_token = create_access_token(user_id), create_refresh_token(user_id)
    jti = verify_token(refresh_token).get('jti')
    user_agent, ip_address = request.headers.get('User-Agent'), request.client.host
    await add_refresh_token_to_db(jti, user_id, user_agent, ip_address, db)
    if not user_id or not access_token or not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )

    return {"message": "Login successfully."}

@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get('refresh_token')
    if refresh_token:
        jti = verify_token(refresh_token).get('jti')
        await revoke_refresh_token(jti, db) 
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logout successfully."}


@router.post("/logout-all")
async def logout_all(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get('refresh_token')
    sub = verify_token(refresh_token).get('sub')
    await revoke_all_refresh_tokens(sub, db)
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logout all successfully."}


@router.post("/refresh")
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    current_refresh_token = request.cookies.get('refresh_token')
    current_payload = verify_token(current_refresh_token)
    current_jti, user_id = current_payload.get('jti'), current_payload.get('sub')
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")

    is_revoked = await check_revoked_refresh_token(current_jti, db)
    if is_revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has already been revoked"
        )
    
    await revoke_refresh_token(current_jti, db)
    new_access_token, new_refresh_token = create_access_token(user_id), create_refresh_token(user_id)
    new_payload = verify_token(new_refresh_token)
    new_jti = new_payload.get('jti')
    user_agent, ip_address = request.headers.get('User-Agent'), request.client.host
    await add_refresh_token_to_db(new_jti, user_id, user_agent, ip_address, db)

    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        path="/"
    )

    return {"message": "Refresh access token successfully."}