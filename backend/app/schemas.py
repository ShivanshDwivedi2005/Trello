from __future__ import annotations

import datetime as dt
import uuid

from pydantic import BaseModel, Field


class MemberOut(BaseModel):
    id: str
    name: str
    avatar: str = ""
    initials: str
    color: str
    email: str | None = None
    role: str | None = None


class LabelOut(BaseModel):
    id: str
    name: str
    color: str


class ChecklistItemOut(BaseModel):
    id: str
    text: str
    completed: bool


class ChecklistOut(BaseModel):
    id: str
    title: str
    items: list[ChecklistItemOut]


class CardOut(BaseModel):
    id: str
    title: str
    description: str
    labels: list[LabelOut]
    members: list[MemberOut]
    dueDate: str | None
    checklists: list[ChecklistOut]
    coverColor: str | None
    archived: bool
    createdAt: str


class ListOut(BaseModel):
    id: str
    title: str
    cards: list[CardOut]


class BoardOut(BaseModel):
    id: str
    title: str
    background: str
    lists: list[ListOut]
    starred: bool
    recentlyViewed: str | None = None


class WorkspaceOut(BaseModel):
    id: str
    name: str
    description: str
    boards: list[BoardOut]
    members: list[MemberOut]
    labels: list[LabelOut]


class WorkspaceUpdateIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(default="", max_length=500)


class BoardCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    background: str = Field(min_length=1, max_length=100)


class BoardUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    background: str | None = Field(default=None, min_length=1, max_length=100)
    starred: bool | None = None


class ListCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class ListUpdateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class ListReorderIn(BaseModel):
    sourceIndex: int = Field(ge=0)
    destIndex: int = Field(ge=0)


class CardCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=300)


class CardUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=300)
    description: str | None = None
    dueDate: str | None = None
    coverColor: str | None = None
    archived: bool | None = None
    labelIds: list[str] | None = None
    memberIds: list[str] | None = None


class CardMoveIn(BaseModel):
    sourceListId: str
    destListId: str
    sourceIndex: int = Field(ge=0)
    destIndex: int = Field(ge=0)


class ChecklistCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class ChecklistItemCreateIn(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class ChecklistItemUpdateIn(BaseModel):
    completed: bool


def iso_date(d: dt.date | None) -> str | None:
    return d.isoformat() if d else None


def iso_dt(d: dt.datetime | None) -> str | None:
    if not d:
        return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.isoformat()


def uuid_str(u: uuid.UUID) -> str:
    return str(u)

