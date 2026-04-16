from __future__ import annotations

import datetime as dt

from app import models
from app.schemas import (
    BoardOut,
    CardOut,
    ChecklistItemOut,
    ChecklistOut,
    LabelOut,
    ListOut,
    MemberOut,
    WorkspaceOut,
    iso_date,
    iso_dt,
    uuid_str,
)


def _as_list(value):
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def member_out(m: models.Member) -> MemberOut:
    return MemberOut(
        id=uuid_str(m.id),
        name=m.name,
        avatar=m.avatar or "",
        initials=m.initials,
        color=m.color,
        email=m.email,
        role=m.role,
    )


def label_out(l: models.Label) -> LabelOut:
    return LabelOut(id=uuid_str(l.id), name=l.name, color=l.color)


def card_out(c: models.Card) -> CardOut:
    labels = [label_out(cl.label) for cl in _as_list(c.labels) if getattr(cl, "label", None) is not None]
    members = [member_out(cm.member) for cm in _as_list(c.members) if getattr(cm, "member", None) is not None]
    checklists = [
        ChecklistOut(
            id=uuid_str(cl.id),
            title=cl.title,
            items=[ChecklistItemOut(id=uuid_str(it.id), text=it.text, completed=it.completed) for it in _as_list(cl.items)],
        )
        for cl in _as_list(c.checklists)
    ]
    created_at = c.created_at
    if created_at.tzinfo is None:
        created_at = created_at.replace(tzinfo=dt.timezone.utc)
    return CardOut(
        id=uuid_str(c.id),
        title=c.title,
        description=c.description or "",
        labels=labels,
        members=members,
        dueDate=iso_date(c.due_date),
        checklists=checklists,
        coverColor=c.cover_color,
        archived=c.archived,
        createdAt=created_at.date().isoformat(),
    )


def list_out(l: models.List) -> ListOut:
    return ListOut(id=uuid_str(l.id), title=l.title, cards=[card_out(c) for c in l.cards])


def board_out(b: models.Board) -> BoardOut:
    return BoardOut(
        id=uuid_str(b.id),
        title=b.title,
        background=b.background,
        lists=[list_out(l) for l in b.lists],
        starred=b.starred,
        recentlyViewed=iso_dt(b.recently_viewed_at),
    )


def workspace_out(ws: models.Workspace) -> WorkspaceOut:
    return WorkspaceOut(
        id=uuid_str(ws.id),
        name=ws.name,
        description=ws.description,
        boards=[board_out(b) for b in ws.boards],
        members=[member_out(m) for m in ws.members],
        labels=[label_out(l) for l in ws.labels],
    )

