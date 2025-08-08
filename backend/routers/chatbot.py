from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth import security, verify_token
import schemas
import random

router = APIRouter()

# Mock customer/account data for demonstration
MOCK_CUSTOMER_DATA = {
    "customer_lookup": [
        {"id": "CUST001", "name": "John Doe", "email": "john.doe@email.com", "phone": "+1-555-0101", "account_type": "Premium"},
        {"id": "CUST002", "name": "Jane Smith", "email": "jane.smith@email.com", "phone": "+1-555-0102", "account_type": "Standard"},
        {"id": "CUST003", "name": "Bob Johnson", "email": "bob.johnson@email.com", "phone": "+1-555-0103", "account_type": "Premium"},
        {"id": "CUST004", "name": "Alice Brown", "email": "alice.brown@email.com", "phone": "+1-555-0104", "account_type": "Business"},
        {"id": "CUST005", "name": "Charlie Wilson", "email": "charlie.wilson@email.com", "phone": "+1-555-0105", "account_type": "Standard"}
    ],
    "account_details": [
        {"account_number": "ACC001", "balance": "$15,432.50", "status": "Active", "last_transaction": "2024-01-15"},
        {"account_number": "ACC002", "balance": "$8,921.33", "status": "Active", "last_transaction": "2024-01-14"},
        {"account_number": "ACC003", "balance": "$42,156.78", "status": "Active", "last_transaction": "2024-01-15"},
        {"account_number": "ACC004", "balance": "$156,789.12", "status": "Active", "last_transaction": "2024-01-13"},
        {"account_number": "ACC005", "balance": "$3,245.67", "status": "Frozen", "last_transaction": "2024-01-10"}
    ],
    "transaction_history": [
        {"date": "2024-01-15", "description": "Online Purchase - Amazon", "amount": "-$124.99", "balance": "$15,307.51"},
        {"date": "2024-01-14", "description": "Salary Deposit", "amount": "+$5,000.00", "balance": "$15,432.50"},
        {"date": "2024-01-13", "description": "ATM Withdrawal", "amount": "-$200.00", "balance": "$10,432.50"},
        {"date": "2024-01-12", "description": "Online Transfer", "amount": "-$1,500.00", "balance": "$10,632.50"},
        {"date": "2024-01-11", "description": "Direct Deposit", "amount": "+$2,500.00", "balance": "$12,132.50"}
    ]
}

def process_chatbot_query(query: str) -> dict:
    """Process chatbot query and return response."""
    query_lower = query.lower()
    
    # Customer lookup queries
    if any(word in query_lower for word in ["customer", "client", "user"]):
        if "lookup" in query_lower or "find" in query_lower or "search" in query_lower:
            customer = random.choice(MOCK_CUSTOMER_DATA["customer_lookup"])
            return {
                "response": f"Found customer: {customer['name']} (ID: {customer['id']})",
                "data": customer
            }
    
    # Account balance queries
    if any(word in query_lower for word in ["balance", "account"]):
        account = random.choice(MOCK_CUSTOMER_DATA["account_details"])
        return {
            "response": f"Account {account['account_number']}: Balance is {account['balance']}, Status: {account['status']}",
            "data": account
        }
    
    # Transaction history queries
    if any(word in query_lower for word in ["transaction", "history", "payment"]):
        transactions = random.sample(MOCK_CUSTOMER_DATA["transaction_history"], 3)
        return {
            "response": "Recent transactions found:",
            "data": {"transactions": transactions}
        }
    
    # Account status queries
    if "status" in query_lower:
        account = random.choice(MOCK_CUSTOMER_DATA["account_details"])
        return {
            "response": f"Account status: {account['status']}, Last transaction: {account['last_transaction']}",
            "data": account
        }
    
    # Contact information queries
    if any(word in query_lower for word in ["contact", "phone", "email"]):
        customer = random.choice(MOCK_CUSTOMER_DATA["customer_lookup"])
        return {
            "response": f"Contact info - Email: {customer['email']}, Phone: {customer['phone']}",
            "data": customer
        }
    
    # Default responses for common banking queries
    banking_responses = [
        "I can help you find customer information, account balances, transaction history, and contact details.",
        "Try asking about: 'customer lookup', 'account balance', 'transaction history', or 'contact information'.",
        "What specific customer or account information do you need?",
        "I have access to customer profiles, account details, and transaction data. How can I assist?",
        "You can ask me to find customers, check balances, view transactions, or get contact info."
    ]
    
    return {
        "response": random.choice(banking_responses),
        "data": None
    }

@router.post("/query", response_model=schemas.ChatbotResponse)
async def chatbot_query(
    query_data: schemas.ChatbotQuery,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Process chatbot query and return response."""
    current_user = verify_token(credentials, db)
    
    # Only ops users can use chatbot
    if current_user.role not in [models.UserRole.OPS_MEMBER, models.UserRole.TEAM_LEAD, models.UserRole.MANAGER]:
        raise HTTPException(
            status_code=403,
            detail="Chatbot access restricted to operations staff"
        )
    
    try:
        result = process_chatbot_query(query_data.query)
        return schemas.ChatbotResponse(**result)
    except Exception as e:
        return schemas.ChatbotResponse(
            response="Sorry, I encountered an error processing your query. Please try again.",
            data=None
        )

@router.get("/suggestions")
async def get_chatbot_suggestions(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get chatbot query suggestions."""
    current_user = verify_token(credentials, db)
    
    suggestions = [
        "Find customer by email",
        "Check account balance for customer ID",
        "Show recent transactions",
        "Get customer contact information",
        "Check account status",
        "Lookup customer details",
        "Show transaction history",
        "Find account by number"
    ]
    
    return {"suggestions": suggestions}