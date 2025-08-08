from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional, List
from models import UserRole, ComplaintStatus, ComplaintSeverity
import re

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole
    is_active: bool = True
    team_id: Optional[int] = None

class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    team_id: Optional[int] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# Team schemas
class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None
    manager_id: Optional[int] = None
    team_lead_id: Optional[int] = None
    is_active: bool = True

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    manager_id: Optional[int] = None
    team_lead_id: Optional[int] = None
    is_active: Optional[bool] = None

class Team(TeamBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Complaint schemas
class ComplaintBase(BaseModel):
    product: str
    subproduct: Optional[str] = None
    issue: str
    subissue: Optional[str] = None
    description: str
    severity: ComplaintSeverity

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    assigned_team_id: Optional[int] = None
    assigned_to_id: Optional[int] = None
    description: Optional[str] = None
    severity: Optional[ComplaintSeverity] = None

class Complaint(ComplaintBase):
    id: int
    complaint_number: str
    status: ComplaintStatus
    customer_id: int
    assigned_team_id: Optional[int] = None
    assigned_to_id: Optional[int] = None
    sla_hours: int
    sla_breach: bool
    resolution_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Note schemas
class ComplaintNoteBase(BaseModel):
    note: str
    is_internal: bool = True

class ComplaintNoteCreate(ComplaintNoteBase):
    complaint_id: int

class ComplaintNote(ComplaintNoteBase):
    id: int
    complaint_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# SLA Matrix schemas
class SLAMatrixBase(BaseModel):
    product: str
    subproduct: Optional[str] = None
    issue: str
    subissue: Optional[str] = None
    severity: ComplaintSeverity
    sla_hours: int
    is_active: bool = True

class SLAMatrixCreate(SLAMatrixBase):
    pass

class SLAMatrixUpdate(BaseModel):
    product: Optional[str] = None
    subproduct: Optional[str] = None
    issue: Optional[str] = None
    subissue: Optional[str] = None
    severity: Optional[ComplaintSeverity] = None
    sla_hours: Optional[int] = None
    is_active: Optional[bool] = None

class SLAMatrix(SLAMatrixBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    total_complaints: int
    open_complaints: int
    inprocess_complaints: int
    pending_complaints: int
    closed_complaints: int
    sla_breached: int
    avg_resolution_time: Optional[float] = None

# Chatbot schemas
class ChatbotQuery(BaseModel):
    query: str
    context: Optional[str] = None

class ChatbotResponse(BaseModel):
    response: str
    data: Optional[dict] = None