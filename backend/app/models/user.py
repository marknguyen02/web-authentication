from sqlalchemy import Column, String, Enum
from sqlalchemy.orm import relationship
from app.models.base import Base
from enum import Enum as PyEnum

class Role(PyEnum):
    admin = "admin"
    user = "user"

# Định nghĩa bảng User
class User(Base):
    __tablename__ = 'users'

    user_id = Column(String, primary_key=True, index=True, nullable=False, unique=True)
    username = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.user)