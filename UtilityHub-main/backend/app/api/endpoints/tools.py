from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List

from app.db.session import get_db
from app.db import models
from app.api import deps

router = APIRouter()

class ToolLogRequest(BaseModel):
    tool_id: str

@router.post("/log")
def log_tool_use(
    log_in: ToolLogRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(deps.get_current_user)
):
    user_id = current_user.id if current_user else None
    db_log = models.UsageLog(user_id=user_id, tool_id=log_in.tool_id)
    db.add(db_log)
    db.commit()
    return {"status": "success", "tool_id": log_in.tool_id}

@router.get("/favorites", response_model=List[str])
def get_user_favorites(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    favs = db.query(models.Favorite).filter(models.Favorite.user_id == current_user.id).all()
    return [f.tool_id for f in favs]

@router.post("/favorites/{tool_id}")
def add_favorite(
    tool_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    # Check if exists
    exists = db.query(models.Favorite).filter(
        models.Favorite.user_id == current_user.id,
        models.Favorite.tool_id == tool_id
    ).first()
    
    if exists:
        # Toggle: Remove if exists
        db.delete(exists)
        db.commit()
        return {"status": "removed", "tool_id": tool_id}
    
    fav = models.Favorite(user_id=current_user.id, tool_id=tool_id)
    db.add(fav)
    db.commit()
    return {"status": "added", "tool_id": tool_id}

@router.get("/analytics")
def get_global_analytics(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_active_admin)
):
    total_runs = db.query(models.UsageLog).count()
    popular_tools = db.query(
        models.UsageLog.tool_id, 
        func.count(models.UsageLog.id).label("count")
    ).group_by(models.UsageLog.tool_id).order_by(func.count(models.UsageLog.id).desc()).limit(5).all()
    
    return {
        "total_executions": total_runs,
        "popular_tools": [{"tool_id": r[0], "runs": r[1]} for r in popular_tools]
    }
