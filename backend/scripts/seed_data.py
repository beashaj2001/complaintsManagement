#!/usr/bin/env python3
"""Seed database with sample data."""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import sessionmaker
from database import engine
from auth import get_password_hash
import models

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    """Seed database with sample data."""
    print("Seeding database with sample data...")
    
    db = SessionLocal()
    
    try:
        # Create teams
        teams_data = [
            {"name": "Customer Service", "description": "Handles general customer inquiries and complaints"},
            {"name": "Technical Support", "description": "Handles technical issues and system problems"},
            {"name": "Fraud Investigation", "description": "Investigates fraud and security related complaints"},
            {"name": "Loan Services", "description": "Handles loan and mortgage related complaints"}
        ]
        
        teams = []
        for team_data in teams_data:
            team = models.Team(**team_data)
            db.add(team)
            teams.append(team)
        
        db.commit()
        print("✅ Teams created")
        
        # Create users
        users_data = [
            {"email": "admin@bank.com", "full_name": "System Administrator", "password": "admin123", "role": models.UserRole.ADMIN},
            {"email": "manager@bank.com", "full_name": "John Manager", "password": "manager123", "role": models.UserRole.MANAGER, "team_id": teams[0].id},
            {"email": "teamlead@bank.com", "full_name": "Sarah TeamLead", "password": "teamlead123", "role": models.UserRole.TEAM_LEAD, "team_id": teams[0].id},
            {"email": "ops@bank.com", "full_name": "Mike Operations", "password": "ops123", "role": models.UserRole.OPS_MEMBER, "team_id": teams[0].id},
            {"email": "ops2@bank.com", "full_name": "Lisa Support", "password": "ops123", "role": models.UserRole.OPS_MEMBER, "team_id": teams[1].id},
            {"email": "customer@email.com", "full_name": "Jane Customer", "password": "customer123", "role": models.UserRole.CUSTOMER},
            {"email": "customer2@email.com", "full_name": "Bob Customer", "password": "customer123", "role": models.UserRole.CUSTOMER}
        ]
        
        users = []
        for user_data in users_data:
            password = user_data.pop("password")
            user = models.User(
                **user_data,
                hashed_password=get_password_hash(password)
            )
            db.add(user)
            users.append(user)
        
        db.commit()
        
        # Update team managers and leads
        teams[0].manager_id = users[1].id  # John Manager
        teams[0].team_lead_id = users[2].id  # Sarah TeamLead
        teams[1].manager_id = users[1].id
        teams[1].team_lead_id = users[2].id
        
        db.commit()
        print("✅ Users created")
        
        # Create SLA matrix
        sla_data = [
            {"product": "Credit Card", "issue": "Payment Issue", "severity": models.ComplaintSeverity.HIGH, "sla_hours": 4},
            {"product": "Credit Card", "issue": "Payment Issue", "severity": models.ComplaintSeverity.MEDIUM, "sla_hours": 12},
            {"product": "Credit Card", "issue": "Payment Issue", "severity": models.ComplaintSeverity.LOW, "sla_hours": 24},
            {"product": "Savings Account", "issue": "Access Issue", "severity": models.ComplaintSeverity.HIGH, "sla_hours": 2},
            {"product": "Savings Account", "issue": "Access Issue", "severity": models.ComplaintSeverity.MEDIUM, "sla_hours": 8},
            {"product": "Loan", "issue": "Processing Delay", "severity": models.ComplaintSeverity.HIGH, "sla_hours": 8},
            {"product": "Loan", "issue": "Processing Delay", "severity": models.ComplaintSeverity.MEDIUM, "sla_hours": 24},
            {"product": "Online Banking", "issue": "Login Problem", "severity": models.ComplaintSeverity.CRITICAL, "sla_hours": 1},
            {"product": "Online Banking", "issue": "Login Problem", "severity": models.ComplaintSeverity.HIGH, "sla_hours": 2}
        ]
        
        for sla_item in sla_data:
            sla = models.SLAMatrix(**sla_item)
            db.add(sla)
        
        db.commit()
        print("✅ SLA Matrix created")
        
        # Create sample complaints
        complaints_data = [
            {
                "complaint_number": "CMP20240115001",
                "product": "Credit Card",
                "issue": "Payment Issue",
                "description": "Unable to make payment through online portal",
                "severity": models.ComplaintSeverity.HIGH,
                "customer_id": users[5].id,  # Jane Customer
                "status": models.ComplaintStatus.OPEN,
                "sla_hours": 4
            },
            {
                "complaint_number": "CMP20240115002",
                "product": "Savings Account",
                "issue": "Access Issue",
                "description": "Account locked after multiple failed attempts",
                "severity": models.ComplaintSeverity.MEDIUM,
                "customer_id": users[6].id,  # Bob Customer
                "status": models.ComplaintStatus.INPROCESS,
                "assigned_team_id": teams[0].id,
                "assigned_to_id": users[3].id,  # Mike Operations
                "sla_hours": 8
            },
            {
                "complaint_number": "CMP20240115003",
                "product": "Online Banking",
                "issue": "Login Problem",
                "description": "Cannot login to online banking portal",
                "severity": models.ComplaintSeverity.CRITICAL,
                "customer_id": users[5].id,
                "status": models.ComplaintStatus.OPEN,
                "sla_hours": 1
            },
            {
                "complaint_number": "CMP20240115004",
                "product": "Loan",
                "issue": "Processing Delay",
                "description": "Loan application has been pending for over 30 days",
                "severity": models.ComplaintSeverity.HIGH,
                "customer_id": users[6].id,
                "status": models.ComplaintStatus.PENDING,
                "assigned_team_id": teams[3].id,
                "sla_hours": 8
            },
            {
                "complaint_number": "CMP20240115005",
                "product": "Credit Card",
                "issue": "Billing Error",
                "description": "Incorrect charges on monthly statement",
                "severity": models.ComplaintSeverity.MEDIUM,
                "customer_id": users[5].id,
                "status": models.ComplaintStatus.CLOSED,
                "assigned_team_id": teams[0].id,
                "assigned_to_id": users[3].id,
                "sla_hours": 12,
                "resolution_time": models.datetime.utcnow()
            }
        ]
        
        for complaint_data in complaints_data:
            complaint = models.Complaint(**complaint_data)
            db.add(complaint)
        
        db.commit()
        print("✅ Sample complaints created")
        
        print("\n🎉 Database seeded successfully!")
        print("\n👥 Sample Users Created:")
        print("Admin: admin@bank.com / admin123")
        print("Manager: manager@bank.com / manager123")
        print("Team Lead: teamlead@bank.com / teamlead123")
        print("Ops Member: ops@bank.com / ops123")
        print("Customer: customer@email.com / customer123")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    success = seed_data()
    if not success:
        sys.exit(1)