from __future__ import annotations

import datetime as dt
import uuid

from sqlalchemy import select, func, delete
from sqlalchemy.orm import Session, selectinload

from app import models


DEFAULT_WORKSPACE_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")


def ensure_default_workspace(db: Session) -> models.Workspace:
    ws = db.get(models.Workspace, DEFAULT_WORKSPACE_ID)
    if ws:
        return ws
    ws = models.Workspace(id=DEFAULT_WORKSPACE_ID, name="Workspace", description="")
    db.add(ws)
    db.flush()
    return ws


def get_workspace(db: Session) -> models.Workspace:
    ws = ensure_default_workspace(db)
    return (
        db.execute(
            select(models.Workspace)
            .where(models.Workspace.id == ws.id)
            .options(
                selectinload(models.Workspace.members),
                selectinload(models.Workspace.labels),
                selectinload(models.Workspace.boards)
                .selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.labels)
                .selectinload(models.CardLabel.label),
                selectinload(models.Workspace.boards)
                .selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.members)
                .selectinload(models.CardMember.member),
                selectinload(models.Workspace.boards)
                .selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.checklists)
                .selectinload(models.Checklist.items),
            )
        )
        .scalars()
        .one()
    )


def get_board(db: Session, board_id: uuid.UUID) -> models.Board:
    return (
        db.execute(
            select(models.Board)
            .where(models.Board.id == board_id)
            .options(
                selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.labels)
                .selectinload(models.CardLabel.label),
                selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.members)
                .selectinload(models.CardMember.member),
                selectinload(models.Board.lists)
                .selectinload(models.List.cards)
                .selectinload(models.Card.checklists)
                .selectinload(models.Checklist.items),
            )
        )
        .scalars()
        .one()
    )


def create_board(db: Session, title: str, background: str) -> models.Board:
    ws = ensure_default_workspace(db)
    b = models.Board(workspace_id=ws.id, title=title, background=background, starred=False)
    db.add(b)
    db.flush()
    return b


def touch_board_recent(db: Session, board_id: uuid.UUID) -> None:
    b = db.get(models.Board, board_id)
    if not b:
        return
    b.recently_viewed_at = dt.datetime.now(dt.timezone.utc)


def create_list(db: Session, board_id: uuid.UUID, title: str) -> models.List:
    max_pos = db.execute(select(func.max(models.List.position)).where(models.List.board_id == board_id)).scalar_one()
    pos = int(max_pos + 1) if max_pos is not None else 0
    l = models.List(board_id=board_id, title=title, position=pos)
    db.add(l)
    db.flush()
    return l


def reorder_lists(db: Session, board_id: uuid.UUID, source_index: int, dest_index: int) -> None:
    lists = db.execute(select(models.List).where(models.List.board_id == board_id).order_by(models.List.position)).scalars().all()
    if source_index < 0 or dest_index < 0 or source_index >= len(lists) or dest_index >= len(lists):
        return
    moved = lists.pop(source_index)
    lists.insert(dest_index, moved)
    for i, l in enumerate(lists):
        l.position = i


def create_card(db: Session, list_id: uuid.UUID, title: str) -> models.Card:
    max_pos = db.execute(select(func.max(models.Card.position)).where(models.Card.list_id == list_id)).scalar_one()
    pos = int(max_pos + 1) if max_pos is not None else 0
    c = models.Card(
        list_id=list_id,
        title=title,
        description="",
        due_date=None,
        cover_color=None,
        archived=False,
        position=pos,
    )
    db.add(c)
    db.flush()
    return c


def move_card(db: Session, source_list_id: uuid.UUID, dest_list_id: uuid.UUID, source_index: int, dest_index: int) -> None:
    src = db.execute(select(models.Card).where(models.Card.list_id == source_list_id).order_by(models.Card.position)).scalars().all()
    dst = src if source_list_id == dest_list_id else db.execute(select(models.Card).where(models.Card.list_id == dest_list_id).order_by(models.Card.position)).scalars().all()

    if source_index < 0 or source_index >= len(src) or dest_index < 0 or dest_index > len(dst):
        return
    moved = src.pop(source_index)
    moved.list_id = dest_list_id
    if source_list_id == dest_list_id:
        dst.insert(dest_index, moved)
        for i, c in enumerate(dst):
            c.position = i
        return

    dst.insert(dest_index, moved)
    for i, c in enumerate(src):
        c.position = i
    for i, c in enumerate(dst):
        c.position = i


def set_card_labels(db: Session, card: models.Card, label_ids: list[uuid.UUID]) -> None:
    existing = {cl.label_id for cl in card.labels}
    wanted = set(label_ids)
    # remove
    card.labels[:] = [cl for cl in card.labels if cl.label_id in wanted]
    # add
    for lid in label_ids:
        if lid not in existing:
            card.labels.append(models.CardLabel(card_id=card.id, label_id=lid))


def set_card_members(db: Session, card: models.Card, member_ids: list[uuid.UUID]) -> None:
    existing = {cm.member_id for cm in card.members}
    wanted = set(member_ids)
    card.members[:] = [cm for cm in card.members if cm.member_id in wanted]
    for mid in member_ids:
        if mid not in existing:
            card.members.append(models.CardMember(card_id=card.id, member_id=mid))


def delete_list(db: Session, list_id: uuid.UUID) -> None:
    l = db.get(models.List, list_id)
    if l:
        db.delete(l)


def delete_card(db: Session, card_id: uuid.UUID) -> None:
    c = db.get(models.Card, card_id)
    if c:
        db.delete(c)


def create_checklist(db: Session, card_id: uuid.UUID, title: str) -> models.Checklist:
    max_pos = db.execute(select(func.max(models.Checklist.position)).where(models.Checklist.card_id == card_id)).scalar_one()
    pos = int(max_pos + 1) if max_pos is not None else 0
    cl = models.Checklist(card_id=card_id, title=title, position=pos)
    db.add(cl)
    db.flush()
    return cl


def add_checklist_item(db: Session, checklist_id: uuid.UUID, text: str) -> models.ChecklistItem:
    max_pos = db.execute(select(func.max(models.ChecklistItem.position)).where(models.ChecklistItem.checklist_id == checklist_id)).scalar_one()
    pos = int(max_pos + 1) if max_pos is not None else 0
    item = models.ChecklistItem(checklist_id=checklist_id, text=text, completed=False, position=pos)
    db.add(item)
    db.flush()
    return item


def delete_checklist(db: Session, checklist_id: uuid.UUID) -> None:
    cl = db.get(models.Checklist, checklist_id)
    if cl:
        db.delete(cl)


def delete_checklist_item(db: Session, item_id: uuid.UUID) -> None:
    it = db.get(models.ChecklistItem, item_id)
    if it:
        db.delete(it)

