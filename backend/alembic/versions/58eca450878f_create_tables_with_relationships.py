"""Create tables with relationships

Revision ID: 58eca450878f
Revises: 6e7a1710d4ac
Create Date: 2025-02-09 15:42:36.802193

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58eca450878f'
down_revision: Union[str, None] = '6e7a1710d4ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
