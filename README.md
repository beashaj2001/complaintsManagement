# Complaint Management System

A comprehensive complaint management system for the financial/banking domain with role-based access control, SLA management, and modern UI.

## Features

### Customer Portal
- Submit new complaints with attachments
- Track complaint status and history
- View SLA countdown

### Bank Operations Portal
- **Manager View**: Dashboard showing complaints pending for each team
- **Team View**: Dashboard showing complaints pending for each team member
- **Individual View**: Personal complaint queue with detailed view
- Integrated chatbot for customer/account queries
- SLA countdown with visual indicators

### Admin Portal
- SLA Matrix Management (configurable by product, severity, etc.)
- User & Team Management
- Agent automation trigger

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- Axios for API calls

### Backend
- Python FastAPI
- SQLAlchemy ORM with MySQL
- Pydantic for data validation
- JWT authentication
- Bcrypt for password hashing

### Database
- MySQL 8.0+

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.9+
- MySQL 8.0+

### Database Setup
1. Install MySQL and create a database:
```sql
CREATE DATABASE complaint_management;
CREATE USER 'complaint_user'@'localhost' IDENTIFIED BY 'complaint_password';
GRANT ALL PRIVILEGES ON complaint_management.* TO 'complaint_user'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set environment variables:
```bash
export DATABASE_URL="mysql+pymysql://complaint_user:complaint_password@localhost/complaint_management"
export SECRET_KEY="your-secret-key-here"
export ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Initialize database:
```bash
python scripts/init_db.py
python scripts/seed_data.py
```

6. Start the server:
```bash
uvicorn main:app --reload
```

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## Default Login Credentials

### Admin
- Email: admin@bank.com
- Password: admin123

### Manager
- Email: manager@bank.com
- Password: manager123

### Team Lead
- Email: teamlead@bank.com
- Password: teamlead123

### Ops Member
- Email: ops@bank.com
- Password: ops123

### Customer
- Email: customer@email.com
- Password: customer123

## API Documentation
Once the backend is running, visit: http://localhost:8000/docs

## Features Overview

### Role-based Access Control
- **Customer**: Submit and track complaints
- **Ops Member**: Handle assigned complaints
- **Team Lead**: Manage team complaints and assignments
- **Manager**: Oversee multiple teams
- **Admin**: System configuration and user management

### SLA Management
- Configurable SLA matrix based on product, severity, issue type
- Real-time SLA countdown with visual indicators
- Automatic breach detection and flagging

### Status Flow
- Open → InProcess → Pending → Closed
- Comprehensive audit trail for all status changes

### Advanced Features
- File attachments for complaints
- Internal notes and communication
- Integrated chatbot for quick customer lookups
- Agent automation capabilities
- Advanced filtering and pagination
- Dark/Light mode toggle
- Responsive design for all devices