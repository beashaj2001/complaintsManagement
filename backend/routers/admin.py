from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth import security, verify_token, check_permission
import models
import schemas

router = APIRouter()

# Team management
@router.post("/teams", response_model=schemas.Team)
async def create_team(
    team: schemas.TeamCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Create a new team."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin"])
    
    db_team = models.Team(**team.dict())
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    
    return db_team

@router.get("/teams", response_model=List[schemas.Team])
async def read_teams(
    skip: int = 0,
    limit: int = 100,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get all teams."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin", "manager"])
    
    teams = db.query(models.Team).offset(skip).limit(limit).all()
    return teams

@router.put("/teams/{team_id}", response_model=schemas.Team)
async def update_team(
    team_id: int,
    team_update: schemas.TeamUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Update team."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin"])
    
    team = db.query(models.Team).filter(models.Team.id == team_id).first()
    if team is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    update_data = team_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(team, field, value)
    
    db.commit()
    db.refresh(team)
    
    return team

# SLA Matrix management
@router.post("/sla-matrix", response_model=schemas.SLAMatrix)
async def create_sla_rule(
    sla_rule: schemas.SLAMatrixCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Create SLA rule."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin"])
    
    db_sla = models.SLAMatrix(**sla_rule.dict())
    db.add(db_sla)
    db.commit()
    db.refresh(db_sla)
    
    return db_sla

@router.get("/sla-matrix", response_model=List[schemas.SLAMatrix])
async def read_sla_rules(
    skip: int = 0,
    limit: int = 100,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get all SLA rules."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin", "manager", "team_lead"])
    
    sla_rules = db.query(models.SLAMatrix).offset(skip).limit(limit).all()
    return sla_rules

@router.put("/sla-matrix/{sla_id}", response_model=schemas.SLAMatrix)
async def update_sla_rule(
    sla_id: int,
    sla_update: schemas.SLAMatrixUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Update SLA rule."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin"])
    
    sla_rule = db.query(models.SLAMatrix).filter(models.SLAMatrix.id == sla_id).first()
    if sla_rule is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SLA rule not found"
        )
    
    update_data = sla_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sla_rule, field, value)
    
    db.commit()
    db.refresh(sla_rule)
    
    return sla_rule

@router.post("/agent-action")
async def run_agent_action(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Run agent automation action."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["admin"])
    
    # Mock agent action - in reality this would trigger complex automation
    # For example: auto-assign complaints based on workload, escalate overdue complaints, etc.
    
    import random
    import time
    
    # Simulate processing time
    time.sleep(2)
    
    # Mock results
    actions_performed = [
        "Auto-assigned 5 complaints based on team workload",
        "Escalated 2 overdue complaints to managers",
        "Updated SLA breach flags for 8 complaints",
        "Sent notification emails to 12 customers",
        "Generated performance reports for 3 teams"
    ]
    
    selected_actions = random.sample(actions_performed, random.randint(2, 4))
    
    return {
        "status": "success",
        "message": "Agent automation completed successfully",
        "actions_performed": selected_actions,
        "timestamp": models.datetime.utcnow().isoformat()
    }