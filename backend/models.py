from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    CUSTOMER = "customer"
    OPS_MEMBER = "ops_member"
    TEAM_LEAD = "team_lead"
    MANAGER = "manager"
    ADMIN = "admin"

class ComplaintStatus(str, enum.Enum):
    OPEN = "open"
    INPROCESS = "inprocess"
    PENDING = "pending"
    CLOSED = "closed"

class ComplaintSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    team = relationship("Team", back_populates="members")
    assigned_complaints = relationship("Complaint", back_populates="assigned_to")
    created_complaints = relationship("Complaint", back_populates="customer")

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    manager_id = Column(Integer, ForeignKey("users.id"))
    team_lead_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    members = relationship("User", back_populates="team")
    complaints = relationship("Complaint", back_populates="assigned_team")

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, nullable=False)
    product = Column(String(100), nullable=False)
    subproduct = Column(String(100))
    issue = Column(String(100), nullable=False)
    subissue = Column(String(100))
    description = Column(Text, nullable=False)
    severity = Column(Enum(ComplaintSeverity), nullable=False)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.OPEN)
    
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_team_id = Column(Integer, ForeignKey("teams.id"))
    assigned_to_id = Column(Integer, ForeignKey("users.id"))
    
    sla_hours = Column(Integer, default=24)
    sla_breach = Column(Boolean, default=False)
    resolution_time = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    customer = relationship("User", foreign_keys=[customer_id], back_populates="created_complaints")
    assigned_team = relationship("Team", back_populates="complaints")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="assigned_complaints")
    notes = relationship("ComplaintNote", back_populates="complaint")
    attachments = relationship("ComplaintAttachment", back_populates="complaint")
    history = relationship("ComplaintHistory", back_populates="complaint")

class ComplaintNote(Base):
    __tablename__ = "complaint_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    note = Column(Text, nullable=False)
    is_internal = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="notes")
    user = relationship("User")

class ComplaintAttachment(Base):
    __tablename__ = "complaint_attachments"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="attachments")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)
    old_value = Column(String(255))
    new_value = Column(String(255))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    complaint = relationship("Complaint", back_populates="history")
    user = relationship("User")

class SLAMatrix(Base):
    __tablename__ = "sla_matrix"
    
    id = Column(Integer, primary_key=True, index=True)
    product = Column(String(100), nullable=False)
    subproduct = Column(String(100))
    issue = Column(String(100), nullable=False)
    subissue = Column(String(100))
    severity = Column(Enum(ComplaintSeverity), nullable=False)
    sla_hours = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)