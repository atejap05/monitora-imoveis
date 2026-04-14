"""Baseline schema: property and propertyhistory (PostgreSQL).

Revision ID: 20260414_0001
Revises:
Create Date: 2026-04-14
"""

from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "20260414_0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "property",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("url", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=True),
        sa.Column("price", sa.Numeric(12, 2), nullable=True),
        sa.Column("previous_price", sa.Numeric(12, 2), nullable=True),
        sa.Column("bedrooms", sa.Integer(), nullable=True),
        sa.Column("bathrooms", sa.Integer(), nullable=True),
        sa.Column("suites", sa.Integer(), nullable=True),
        sa.Column("size", sa.String(), nullable=True),
        sa.Column("parking_spots", sa.Integer(), nullable=True),
        sa.Column("address", sa.String(), nullable=True),
        sa.Column("neighborhood", sa.String(), nullable=True),
        sa.Column("city", sa.String(), nullable=True),
        sa.Column("property_type", sa.String(), nullable=True),
        sa.Column("source", sa.String(), nullable=True),
        sa.Column("image_url", sa.String(), nullable=True),
        sa.Column("comment", sa.String(length=2000), nullable=True),
        sa.Column("favorite", sa.Boolean(), nullable=False),
        sa.Column("condo_fee", sa.Numeric(12, 2), nullable=True),
        sa.Column("iptu", sa.Numeric(12, 2), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("reference_code", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("user_id", "url", name="uq_property_user_url"),
    )
    op.create_index(op.f("ix_property_user_id"), "property", ["user_id"], unique=False)
    op.create_index(op.f("ix_property_url"), "property", ["url"], unique=False)

    op.create_table(
        "propertyhistory",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("property_id", sa.Integer(), nullable=False),
        sa.Column("price", sa.Numeric(12, 2), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("checked_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["property_id"],
            ["property.id"],
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_propertyhistory_property_id"),
        "propertyhistory",
        ["property_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_propertyhistory_property_id"),
        table_name="propertyhistory",
    )
    op.drop_table("propertyhistory")
    op.drop_index(op.f("ix_property_url"), table_name="property")
    op.drop_index(op.f("ix_property_user_id"), table_name="property")
    op.drop_table("property")
