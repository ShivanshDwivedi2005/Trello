from __future__ import annotations

import datetime as dt

from sqlalchemy import select

from app.db import SessionLocal
from app import crud, models


def seed():
    db = SessionLocal()
    try:
        ws = crud.ensure_default_workspace(db)
        ws.name = "Trello Workspace"
        ws.description = "Trello-style workspace dashboard."

        # Members
        if db.execute(select(models.Member).where(models.Member.workspace_id == ws.id)).first() is None:
            members = [
                models.Member(workspace_id=ws.id, name="Shiva B", initials="SB", color="#44546f", email="shiva@example.com", role="admin"),
                models.Member(workspace_id=ws.id, name="Sarah Chen", initials="SC", color="#579dff", email="sarah@example.com", role="member"),
                models.Member(workspace_id=ws.id, name="Mike Davis", initials="MD", color="#4bce97", email="mike@example.com", role="member"),
                models.Member(workspace_id=ws.id, name="Emma Wilson", initials="EW", color="#9f8fef", email="emma@example.com", role="member"),
            ]
            db.add_all(members)

        # Labels
        if db.execute(select(models.Label).where(models.Label.workspace_id == ws.id)).first() is None:
            labels = [
                models.Label(workspace_id=ws.id, name="Bug", color="var(--label-red)"),
                models.Label(workspace_id=ws.id, name="Feature", color="var(--label-green)"),
                models.Label(workspace_id=ws.id, name="Urgent", color="var(--label-orange)"),
                models.Label(workspace_id=ws.id, name="Design", color="var(--label-purple)"),
                models.Label(workspace_id=ws.id, name="Backend", color="var(--label-blue)"),
                models.Label(workspace_id=ws.id, name="Review", color="var(--label-yellow)"),
            ]
            db.add_all(labels)

        # Boards + Lists + Cards (only seed once)
        existing_board = db.execute(select(models.Board).where(models.Board.workspace_id == ws.id)).scalars().first()
        if not existing_board:
            now = dt.datetime.now(dt.timezone.utc)
            members = db.execute(select(models.Member).where(models.Member.workspace_id == ws.id)).scalars().all()
            labels = db.execute(select(models.Label).where(models.Label.workspace_id == ws.id)).scalars().all()
            by_label = {l.name: l for l in labels}
            by_member = {m.initials: m for m in members}

            def make_board(title: str, background: str, starred: bool) -> models.Board:
                b = models.Board(
                    workspace_id=ws.id,
                    title=title,
                    background=background,
                    starred=starred,
                    recently_viewed_at=now,
                )
                db.add(b)
                db.flush()
                return b

            def add_list(board: models.Board, title: str, position: int) -> models.List:
                l = models.List(board_id=board.id, title=title, position=position)
                db.add(l)
                db.flush()
                return l

            def add_card(lst: models.List, title: str, desc: str = "", position: int = 0, due: str | None = None, cover: str | None = None) -> models.Card:
                c = models.Card(
                    list_id=lst.id,
                    title=title,
                    description=desc,
                    position=position,
                    created_at=now,
                    due_date=dt.date.fromisoformat(due) if due else None,
                    cover_color=cover,
                )
                db.add(c)
                db.flush()
                return c

            def attach_label(card: models.Card, label: models.Label):
                db.add(models.CardLabel(card_id=card.id, label_id=label.id))

            def attach_member(card: models.Card, member: models.Member):
                db.add(models.CardMember(card_id=card.id, member_id=member.id))

            def add_checklist(card: models.Card, title: str, items: list[tuple[str, bool]]):
                cl = models.Checklist(card_id=card.id, title=title, position=0)
                db.add(cl)
                db.flush()
                for idx, (text, done) in enumerate(items):
                    db.add(models.ChecklistItem(checklist_id=cl.id, text=text, completed=done, position=idx))

            # Board 1
            b1 = make_board("My Trello board", "linear-gradient(135deg, #8b6adf 0%, #d56cb8 100%)", starred=True)
            l1 = add_list(b1, "To Do", 0)
            l2 = add_list(b1, "In Progress", 1)
            l3 = add_list(b1, "Review", 2)
            l4 = add_list(b1, "Done", 3)

            c1 = add_card(
                l1,
                "Research competitor analysis",
                "Analyze top 5 competitors and create a comparison matrix.",
                position=0,
                due=(dt.date.today() + dt.timedelta(days=5)).isoformat(),
            )
            if "Feature" in by_label:
                attach_label(c1, by_label["Feature"])
            if "Review" in by_label:
                attach_label(c1, by_label["Review"])
            if "AJ" in by_member:
                attach_member(c1, by_member["AJ"])
            if "SC" in by_member:
                attach_member(c1, by_member["SC"])
            add_checklist(
                c1,
                "Research Steps",
                [("Identify competitors", True), ("Gather pricing data", False), ("Compare features", False)],
            )

            c2 = add_card(l1, "Design landing page mockup", "", position=1, cover="hsl(270 50% 55%)")
            if "Design" in by_label:
                attach_label(c2, by_label["Design"])
            if "EW" in by_member:
                attach_member(c2, by_member["EW"])

            c3 = add_card(
                l2,
                "Implement drag & drop",
                "Smooth list and card reordering.",
                position=0,
                due=(dt.date.today() + dt.timedelta(days=2)).isoformat(),
                cover="hsl(214 80% 52%)",
            )
            if "Backend" in by_label:
                attach_label(c3, by_label["Backend"])
            if "Feature" in by_label:
                attach_label(c3, by_label["Feature"])
            if "MD" in by_member:
                attach_member(c3, by_member["MD"])
            if "AJ" in by_member:
                attach_member(c3, by_member["AJ"])
            add_checklist(c3, "D&D Tasks", [("Reorder lists", True), ("Move cards across lists", False), ("Keyboard accessibility", False)])

            add_card(l4, "Project setup and boilerplate", "React + FastAPI + Postgres.", position=0, due=(dt.date.today() - dt.timedelta(days=4)).isoformat(), cover="hsl(145 63% 42%)")

            # Board 2
            b2 = make_board("project scalar", "linear-gradient(135deg, #3f2ac4 0%, #cc3fa2 100%)", starred=False)
            ideas = add_list(b2, "Ideas", 0)
            progress = add_list(b2, "In Progress", 1)
            published = add_list(b2, "Published", 2)
            c4 = add_card(ideas, "Social media content calendar", "", position=0)
            if "Feature" in by_label:
                attach_label(c4, by_label["Feature"])
            if "SC" in by_member:
                attach_member(c4, by_member["SC"])

            # Board 3
            b3 = make_board("Design sprint", "linear-gradient(135deg, #3f2ac4 0%, #cc3fa2 100%)", starred=False)
            reported = add_list(b3, "Reported", 0)
            investigating = add_list(b3, "Investigating", 1)
            fixed = add_list(b3, "Fixed", 2)
            c5 = add_card(reported, "Login page crashes on Safari", "Users report white screen on Safari.", position=0, due=(dt.date.today() + dt.timedelta(days=1)).isoformat())
            if "Bug" in by_label:
                attach_label(c5, by_label["Bug"])
            if "SC" in by_member:
                attach_member(c5, by_member["SC"])

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()

