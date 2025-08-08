from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from database import get_db
from auth import security, verify_token, check_permission
import models
import schemas
from datetime import datetime
import uuid

router = APIRouter()

def generate_complaint_number():
    """Generate unique complaint number."""
    return f"CMP{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"

def calculate_sla(db: Session, complaint: models.Complaint) -> int:
    """Calculate SLA hours based on complaint details."""
    sla_rule = db.query(models.SLAMatrix).filter(
        and_(
            models.SLAMatrix.product == complaint.product,
            models.SLAMatrix.issue == complaint.issue,
            models.SLAMatrix.severity == complaint.severity,
            models.SLAMatrix.is_active == True
        )
    ).first()
    
    if sla_rule:
        return sla_rule.sla_hours
    
    # Default SLA based on severity
    default_sla = {
        "critical": 4,
        "high": 12,
        "medium": 24,
        "low": 48
    }
    return default_sla.get(complaint.severity.value, 24)

@router.post("/", response_model=schemas.Complaint)
async def create_complaint(
    complaint: schemas.ComplaintCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Create a new complaint."""
    current_user = verify_token(credentials, db)
    
    db_complaint = models.Complaint(
        complaint_number=generate_complaint_number(),
        product=complaint.product,
        subproduct=complaint.subproduct,
        issue=complaint.issue,
        subissue=complaint.subissue,
        description=complaint.description,
        severity=complaint.severity,
        customer_id=current_user.id
    )
    
    # Calculate SLA
    db_complaint.sla_hours = calculate_sla(db, db_complaint)
    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    # Add history entry
    history = models.ComplaintHistory(
        complaint_id=db_complaint.id,
        user_id=current_user.id,
        action="Created",
        new_value="open",
        notes="Complaint created"
    )
    db.add(history)
    db.commit()
    
    return db_complaint

@router.get("/", response_model=List[schemas.Complaint])
async def read_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    team_id: Optional[int] = Query(None),
    assigned_to_me: bool = Query(False),
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get complaints with filters."""
    current_user = verify_token(credentials, db)
    
    query = db.query(models.Complaint)
    
    # Apply role-based filtering
    if current_user.role == models.UserRole.CUSTOMER:
        query = query.filter(models.Complaint.customer_id == current_user.id)
    elif current_user.role == models.UserRole.OPS_MEMBER:
        if assigned_to_me:
            query = query.filter(models.Complaint.assigned_to_id == current_user.id)
        else:
            query = query.filter(
                or_(
                    models.Complaint.assigned_team_id == current_user.team_id,
                    models.Complaint.assigned_to_id == current_user.id
                )
            )
    elif current_user.role == models.UserRole.TEAM_LEAD:
        query = query.filter(models.Complaint.assigned_team_id == current_user.team_id)
    elif current_user.role == models.UserRole.MANAGER:
        # Manager can see complaints from teams they manage
        managed_teams = db.query(models.Team).filter(models.Team.manager_id == current_user.id).all()
        team_ids = [team.id for team in managed_teams]
        if team_ids:
            query = query.filter(models.Complaint.assigned_team_id.in_(team_ids))
    
    # Apply filters
    if status:
        query = query.filter(models.Complaint.status == status)
    if severity:
        query = query.filter(models.Complaint.severity == severity)
    if team_id:
        query = query.filter(models.Complaint.assigned_team_id == team_id)
    
    complaints = query.offset(skip).limit(limit).all()
    return complaints

@router.get("/{complaint_id}", response_model=schemas.Complaint)
async def read_complaint(
    complaint_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get specific complaint by ID."""
    current_user = verify_token(credentials, db)
    
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    # Check permissions
    if current_user.role == models.UserRole.CUSTOMER:
        if complaint.customer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    elif current_user.role in [models.UserRole.OPS_MEMBER, models.UserRole.TEAM_LEAD]:
        if complaint.assigned_team_id != current_user.team_id and complaint.assigned_to_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
    
    return complaint

@router.put("/{complaint_id}", response_model=schemas.Complaint)
async def update_complaint(
    complaint_id: int,
    complaint_update: schemas.ComplaintUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Update complaint."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["ops_member", "team_lead", "manager", "admin"])
    
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    # Update complaint fields
    update_data = complaint_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "status" and value == models.ComplaintStatus.CLOSED:
            complaint.resolution_time = datetime.utcnow()
        setattr(complaint, field, value)
    
    complaint.updated_at = datetime.utcnow()
    
    # Add history entry
    if complaint_update.status:
        history = models.ComplaintHistory(
            complaint_id=complaint.id,
            user_id=current_user.id,
            action="Status Changed",
            old_value=complaint.status.value if hasattr(complaint, 'status') else None,
            new_value=complaint_update.status.value,
            notes=f"Status changed to {complaint_update.status.value}"
        )
        db.add(history)
    
    db.commit()
    db.refresh(complaint)
    
    return complaint

@router.post("/{complaint_id}/assign")
async def assign_complaint(
    complaint_id: int,
    assigned_to_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Assign complaint to a user."""
    current_user = verify_token(credentials, db)
    check_permission(current_user, ["team_lead", "manager", "admin"])
    
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if complaint is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    assignee = db.query(models.User).filter(models.User.id == assigned_to_id).first()
    if assignee is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    complaint.assigned_to_id = assigned_to_id
    complaint.assigned_team_id = assignee.team_id
    complaint.status = models.ComplaintStatus.INPROCESS
    complaint.updated_at = datetime.utcnow()
    
    # Add history entry
    history = models.ComplaintHistory(
        complaint_id=complaint.id,
        user_id=current_user.id,
        action="Assigned",
        new_value=assignee.full_name,
        notes=f"Assigned to {assignee.full_name}"
    )
    db.add(history)
    
    db.commit()
    
    return {"message": "Complaint assigned successfully"}

@router.get("/dashboard/stats")
async def get_dashboard_stats(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics."""
    current_user = verify_token(credentials, db)
    
    base_query = db.query(models.Complaint)
    
    # Apply role-based filtering
    if current_user.role == models.UserRole.CUSTOMER:
        base_query = base_query.filter(models.Complaint.customer_id == current_user.id)
    elif current_user.role == models.UserRole.OPS_MEMBER:
        base_query = base_query.filter(
            or_(
                models.Complaint.assigned_team_id == current_user.team_id,
                models.Complaint.assigned_to_id == current_user.id
            )
        )
    elif current_user.role == models.UserRole.TEAM_LEAD:
        base_query = base_query.filter(models.Complaint.assigned_team_id == current_user.team_id)
    elif current_user.role == models.UserRole.MANAGER:
        managed_teams = db.query(models.Team).filter(models.Team.manager_id == current_user.id).all()
        team_ids = [team.id for team in managed_teams]
        if team_ids:
            base_query = base_query.filter(models.Complaint.assigned_team_id.in_(team_ids))
    
    stats = {
        "total_complaints": base_query.count(),
        "open_complaints": base_query.filter(models.Complaint.status == models.ComplaintStatus.OPEN).count(),
        "inprocess_complaints": base_query.filter(models.Complaint.status == models.ComplaintStatus.INPROCESS).count(),
        "pending_complaints": base_query.filter(models.Complaint.status == models.ComplaintStatus.PENDING).count(),
        "closed_complaints": base_query.filter(models.Complaint.status == models.ComplaintStatus.CLOSED).count(),
        "sla_breached": base_query.filter(models.Complaint.sla_breach == True).count(),
    }
    
    return stats