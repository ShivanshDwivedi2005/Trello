from __future__ import annotations

import datetime as dt
import uuid

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.db import get_db
from app.settings import settings
from app import crud, models
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.schemas import (
    BoardCreateIn,
    BoardOut,
    BoardUpdateIn,
    CardCreateIn,
    CardMoveIn,
    CardUpdateIn,
    ChecklistCreateIn,
    ChecklistItemCreateIn,
    ChecklistItemUpdateIn,
    ListCreateIn,
    ListOut,
    ListReorderIn,
    ListUpdateIn,
    WorkspaceOut,
    WorkspaceUpdateIn,
)
from app.transform import board_out, workspace_out


app = FastAPI(title="Trello Clone API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "time": dt.datetime.now(dt.timezone.utc).isoformat()}


@app.get("/workspace", response_model=WorkspaceOut)
def get_workspace(db: Session = Depends(get_db)):
    ws = crud.get_workspace(db)
    return workspace_out(ws)


@app.patch("/workspace", response_model=WorkspaceOut)
def update_workspace(payload: WorkspaceUpdateIn, db: Session = Depends(get_db)):
    ws = crud.ensure_default_workspace(db)
    ws.name = payload.name
    ws.description = payload.description
    db.commit()
    ws = crud.get_workspace(db)
    return workspace_out(ws)


@app.post("/boards", response_model=BoardOut)
def create_board(payload: BoardCreateIn, db: Session = Depends(get_db)):
    b = crud.create_board(db, title=payload.title, background=payload.background)
    crud.touch_board_recent(db, b.id)
    db.commit()
    b = crud.get_board(db, b.id)
    return board_out(b)


@app.get("/boards/{board_id}", response_model=BoardOut)
def get_board(board_id: str, db: Session = Depends(get_db)):
    try:
        bid = uuid.UUID(board_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid board id")
    try:
        crud.touch_board_recent(db, bid)
        db.commit()
        b = crud.get_board(db, bid)
    except Exception:
        raise HTTPException(status_code=404, detail="Board not found")
    return board_out(b)


@app.patch("/boards/{board_id}", response_model=BoardOut)
def update_board(board_id: str, payload: BoardUpdateIn, db: Session = Depends(get_db)):
    try:
        bid = uuid.UUID(board_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid board id")
    b = db.get(models.Board, bid)
    if not b:
        raise HTTPException(status_code=404, detail="Board not found")
    if payload.title is not None:
        b.title = payload.title
    if payload.background is not None:
        b.background = payload.background
    if payload.starred is not None:
        b.starred = payload.starred
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.delete("/boards/{board_id}")
def delete_board(board_id: str, db: Session = Depends(get_db)):
    try:
        bid = uuid.UUID(board_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid board id")
    b = db.get(models.Board, bid)
    if not b:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(b)
    db.commit()
    return {"ok": True}


@app.post("/boards/{board_id}/lists", response_model=BoardOut)
def add_list(board_id: str, payload: ListCreateIn, db: Session = Depends(get_db)):
    bid = uuid.UUID(board_id)
    if not db.get(models.Board, bid):
        raise HTTPException(status_code=404, detail="Board not found")
    crud.create_list(db, bid, payload.title)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.patch("/lists/{list_id}", response_model=BoardOut)
def update_list(list_id: str, payload: ListUpdateIn, db: Session = Depends(get_db)):
    lid = uuid.UUID(list_id)
    l = db.get(models.List, lid)
    if not l:
        raise HTTPException(status_code=404, detail="List not found")
    l.title = payload.title
    bid = l.board_id
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.delete("/lists/{list_id}", response_model=BoardOut)
def remove_list(list_id: str, db: Session = Depends(get_db)):
    lid = uuid.UUID(list_id)
    l = db.get(models.List, lid)
    if not l:
        raise HTTPException(status_code=404, detail="List not found")
    bid = l.board_id
    crud.delete_list(db, lid)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.post("/boards/{board_id}/lists/reorder", response_model=BoardOut)
def reorder_lists(board_id: str, payload: ListReorderIn, db: Session = Depends(get_db)):
    bid = uuid.UUID(board_id)
    if not db.get(models.Board, bid):
        raise HTTPException(status_code=404, detail="Board not found")
    crud.reorder_lists(db, bid, payload.sourceIndex, payload.destIndex)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.post("/lists/{list_id}/cards", response_model=BoardOut)
def add_card(list_id: str, payload: CardCreateIn, db: Session = Depends(get_db)):
    lid = uuid.UUID(list_id)
    l = db.get(models.List, lid)
    if not l:
        raise HTTPException(status_code=404, detail="List not found")
    crud.create_card(db, lid, payload.title)
    db.commit()
    b = crud.get_board(db, l.board_id)
    return board_out(b)


@app.patch("/cards/{card_id}", response_model=BoardOut)
def update_card(card_id: str, payload: CardUpdateIn, db: Session = Depends(get_db)):
    cid = uuid.UUID(card_id)
    c = db.get(models.Card, cid)
    if not c:
        raise HTTPException(status_code=404, detail="Card not found")

    provided = payload.model_fields_set

    if "title" in provided and payload.title is not None:
        c.title = payload.title
    if "description" in provided and payload.description is not None:
        c.description = payload.description
    if "coverColor" in provided:
        c.cover_color = payload.coverColor
    if "archived" in provided and payload.archived is not None:
        c.archived = payload.archived
    if "dueDate" in provided:
        c.due_date = dt.date.fromisoformat(payload.dueDate) if payload.dueDate else None

    if "labelIds" in provided and payload.labelIds is not None:
        lids = [uuid.UUID(x) for x in payload.labelIds]
        c_db = (
            db.execute(select(models.Card).where(models.Card.id == cid).options(selectinload(models.Card.labels)))
            .scalars()
            .one()
        )
        crud.set_card_labels(db, c_db, lids)

    if "memberIds" in provided and payload.memberIds is not None:
        mids = [uuid.UUID(x) for x in payload.memberIds]
        c_db = (
            db.execute(select(models.Card).where(models.Card.id == cid).options(selectinload(models.Card.members)))
            .scalars()
            .one()
        )
        crud.set_card_members(db, c_db, mids)

    bid = c.list.board_id
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.delete("/cards/{card_id}", response_model=BoardOut)
def remove_card(card_id: str, db: Session = Depends(get_db)):
    cid = uuid.UUID(card_id)
    c = db.get(models.Card, cid)
    if not c:
        raise HTTPException(status_code=404, detail="Card not found")
    bid = c.list.board_id
    crud.delete_card(db, cid)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.post("/boards/{board_id}/cards/move", response_model=BoardOut)
def move_card(board_id: str, payload: CardMoveIn, db: Session = Depends(get_db)):
    bid = uuid.UUID(board_id)
    if not db.get(models.Board, bid):
        raise HTTPException(status_code=404, detail="Board not found")
    crud.move_card(
        db,
        source_list_id=uuid.UUID(payload.sourceListId),
        dest_list_id=uuid.UUID(payload.destListId),
        source_index=payload.sourceIndex,
        dest_index=payload.destIndex,
    )
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.post("/cards/{card_id}/checklists", response_model=BoardOut)
def add_checklist(card_id: str, payload: ChecklistCreateIn, db: Session = Depends(get_db)):
    cid = uuid.UUID(card_id)
    c = db.get(models.Card, cid)
    if not c:
        raise HTTPException(status_code=404, detail="Card not found")
    crud.create_checklist(db, cid, payload.title)
    bid = c.list.board_id
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.delete("/checklists/{checklist_id}", response_model=BoardOut)
def delete_checklist(checklist_id: str, db: Session = Depends(get_db)):
    clid = uuid.UUID(checklist_id)
    cl = db.get(models.Checklist, clid)
    if not cl:
        raise HTTPException(status_code=404, detail="Checklist not found")
    bid = cl.card.list.board_id
    crud.delete_checklist(db, clid)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.post("/checklists/{checklist_id}/items", response_model=BoardOut)
def add_checklist_item(checklist_id: str, payload: ChecklistItemCreateIn, db: Session = Depends(get_db)):
    clid = uuid.UUID(checklist_id)
    cl = db.get(models.Checklist, clid)
    if not cl:
        raise HTTPException(status_code=404, detail="Checklist not found")
    crud.add_checklist_item(db, clid, payload.text)
    bid = cl.card.list.board_id
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.patch("/checklist-items/{item_id}", response_model=BoardOut)
def update_checklist_item(item_id: str, payload: ChecklistItemUpdateIn, db: Session = Depends(get_db)):
    iid = uuid.UUID(item_id)
    it = db.get(models.ChecklistItem, iid)
    if not it:
        raise HTTPException(status_code=404, detail="Item not found")
    it.completed = payload.completed
    bid = it.checklist.card.list.board_id
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)


@app.delete("/checklist-items/{item_id}", response_model=BoardOut)
def delete_checklist_item(item_id: str, db: Session = Depends(get_db)):
    iid = uuid.UUID(item_id)
    it = db.get(models.ChecklistItem, iid)
    if not it:
        raise HTTPException(status_code=404, detail="Item not found")
    bid = it.checklist.card.list.board_id
    crud.delete_checklist_item(db, iid)
    db.commit()
    b = crud.get_board(db, bid)
    return board_out(b)

