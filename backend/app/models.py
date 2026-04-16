from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


def _uuid() -> uuid.UUID:
    return uuid.uuid4()


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False, default="")

    boards: Mapped[list["Board"]] = relationship("Board", back_populates="workspace", cascade="all, delete-orphan", uselist=True)
    members: Mapped[list["Member"]] = relationship("Member", back_populates="workspace", cascade="all, delete-orphan", uselist=True)
    labels: Mapped[list["Label"]] = relationship("Label", back_populates="workspace", cascade="all, delete-orphan", uselist=True)


class Member(Base):
    __tablename__ = "members"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)

    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str | None] = mapped_column(String(320), nullable=True)
    initials: Mapped[str] = mapped_column(String(8), nullable=False)
    color: Mapped[str] = mapped_column(String(32), nullable=False)
    avatar: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    role: Mapped[str] = mapped_column(String(16), nullable=False, default="member")  # admin|member

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="members")


class Board(Base):
    __tablename__ = "boards"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    background: Mapped[str] = mapped_column(String(100), nullable=False)
    starred: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    recently_viewed_at: Mapped[dt.datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="boards")
    lists: Mapped[list["List"]] = relationship("List", back_populates="board", cascade="all, delete-orphan", order_by="List.position", uselist=True)


class List(Base):
    __tablename__ = "lists"
    __table_args__ = (UniqueConstraint("board_id", "position", name="uq_lists_board_position"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    board_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("boards.id", ondelete="CASCADE"), nullable=False)

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    board: Mapped["Board"] = relationship("Board", back_populates="lists")
    cards: Mapped[list["Card"]] = relationship("Card", back_populates="list", cascade="all, delete-orphan", order_by="Card.position", uselist=True)


class Card(Base):
    __tablename__ = "cards"
    __table_args__ = (UniqueConstraint("list_id", "position", name="uq_cards_list_position"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    list_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("lists.id", ondelete="CASCADE"), nullable=False)

    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    due_date: Mapped[dt.date | None] = mapped_column(Date, nullable=True)
    cover_color: Mapped[str | None] = mapped_column(String(50), nullable=True)
    archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: dt.datetime.now(dt.timezone.utc))
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    list: Mapped["List"] = relationship("List", back_populates="cards")
    labels: Mapped[list["CardLabel"]] = relationship("CardLabel", back_populates="card", cascade="all, delete-orphan", uselist=True)
    members: Mapped[list["CardMember"]] = relationship("CardMember", back_populates="card", cascade="all, delete-orphan", uselist=True)
    checklists: Mapped[list["Checklist"]] = relationship("Checklist", back_populates="card", cascade="all, delete-orphan", order_by="Checklist.position", uselist=True)


class Label(Base):
    __tablename__ = "labels"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    workspace_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False)

    name: Mapped[str] = mapped_column(String(80), nullable=False)
    color: Mapped[str] = mapped_column(String(60), nullable=False)  # store CSS token or hsl string

    workspace: Mapped["Workspace"] = relationship("Workspace", back_populates="labels")


class CardLabel(Base):
    __tablename__ = "card_labels"
    __table_args__ = (UniqueConstraint("card_id", "label_id", name="uq_card_label"),)

    card_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True)
    label_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("labels.id", ondelete="CASCADE"), primary_key=True)

    card: Mapped["Card"] = relationship("Card", back_populates="labels")
    label: Mapped["Label"] = relationship("Label")


class CardMember(Base):
    __tablename__ = "card_members"
    __table_args__ = (UniqueConstraint("card_id", "member_id", name="uq_card_member"),)

    card_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cards.id", ondelete="CASCADE"), primary_key=True)
    member_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("members.id", ondelete="CASCADE"), primary_key=True)

    card: Mapped["Card"] = relationship("Card", back_populates="members")
    member: Mapped["Member"] = relationship("Member")


class Checklist(Base):
    __tablename__ = "checklists"
    __table_args__ = (UniqueConstraint("card_id", "position", name="uq_checklists_card_position"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    card_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("cards.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    card: Mapped["Card"] = relationship("Card", back_populates="checklists")
    items: Mapped[list["ChecklistItem"]] = relationship("ChecklistItem", back_populates="checklist", cascade="all, delete-orphan", order_by="ChecklistItem.position", uselist=True)


class ChecklistItem(Base):
    __tablename__ = "checklist_items"
    __table_args__ = (UniqueConstraint("checklist_id", "position", name="uq_checklist_items_checklist_position"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    checklist_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("checklists.id", ondelete="CASCADE"), nullable=False)
    text: Mapped[str] = mapped_column(String(500), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)

    checklist: Mapped["Checklist"] = relationship("Checklist", back_populates="items")

