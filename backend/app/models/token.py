from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey
from datetime import datetime, timedelta
from app.models.base import Base
from app.core.config import config

class RefreshToken(Base):
    __tablename__ = 'refresh_tokens'

    jti = Column(String, primary_key=True, index=True, nullable=False)
    sub = Column(String, ForeignKey('users.user_id'), index=True, nullable=False)
    iat = Column(DateTime(timezone=True), nullable=False, default=datetime.now)
    exp = Column(DateTime(timezone=True), nullable=False)
    user_agent = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    revoked = Column(Boolean, nullable=False, default=False)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.exp = datetime.now() + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)