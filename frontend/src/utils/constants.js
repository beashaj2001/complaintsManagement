// Application constants
export const USER_ROLES = {
  CUSTOMER: 'customer',
  OPS_MEMBER: 'ops_member',
  TEAM_LEAD: 'team_lead',
  MANAGER: 'manager',
  ADMIN: 'admin'
}

export const COMPLAINT_STATUS = {
  OPEN: 'open',
  INPROCESS: 'inprocess',
  PENDING: 'pending',
  CLOSED: 'closed'
}

export const COMPLAINT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const PRODUCTS = [
  'Credit Card',
  'Savings Account',
  'Checking Account',
  'Loan',
  'Mortgage',
  'Investment',
  'Online Banking',
  'Mobile App',
  'Insurance'
]

export const ISSUES = [
  'Payment Issue',
  'Access Issue',
  'Processing Delay',
  'Billing Error',
  'Login Problem',
  'Technical Error',
  'Service Quality',
  'Fraud Concern',
  'Account Closure',
  'Information Request'
]

// Status display configurations
export const STATUS_CONFIG = {
  [COMPLAINT_STATUS.OPEN]: {
    label: 'Open',
    className: 'status-open',
    icon: '🆕'
  },
  [COMPLAINT_STATUS.INPROCESS]: {
    label: 'In Process',
    className: 'status-inprocess',
    icon: '⚡'
  },
  [COMPLAINT_STATUS.PENDING]: {
    label: 'Pending',
    className: 'status-pending',
    icon: '⏳'
  },
  [COMPLAINT_STATUS.CLOSED]: {
    label: 'Closed',
    className: 'status-closed',
    icon: '✅'
  }
}

// Severity display configurations
export const SEVERITY_CONFIG = {
  [COMPLAINT_SEVERITY.LOW]: {
    label: 'Low',
    className: 'severity-low',
    icon: '🟢'
  },
  [COMPLAINT_SEVERITY.MEDIUM]: {
    label: 'Medium',
    className: 'severity-medium',
    icon: '🟡'
  },
  [COMPLAINT_SEVERITY.HIGH]: {
    label: 'High',
    className: 'severity-high',
    icon: '🟠'
  },
  [COMPLAINT_SEVERITY.CRITICAL]: {
    label: 'Critical',
    className: 'severity-critical',
    icon: '🔴'
  }
}

// Role display configurations
export const ROLE_CONFIG = {
  [USER_ROLES.CUSTOMER]: {
    label: 'Customer',
    color: 'text-blue-600 dark:text-blue-400'
  },
  [USER_ROLES.OPS_MEMBER]: {
    label: 'Operations Member',
    color: 'text-green-600 dark:text-green-400'
  },
  [USER_ROLES.TEAM_LEAD]: {
    label: 'Team Lead',
    color: 'text-purple-600 dark:text-purple-400'
  },
  [USER_ROLES.MANAGER]: {
    label: 'Manager',
    color: 'text-orange-600 dark:text-orange-400'
  },
  [USER_ROLES.ADMIN]: {
    label: 'Administrator',
    color: 'text-red-600 dark:text-red-400'
  }
}

// Animation variants for Framer Motion
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }
}

// Chart colors for dashboards
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#14B8A6',
  accent: '#F97316',
  success: '#22C55E',
  warning: '#EAB308',
  error: '#EF4444',
  info: '#06B6D4',
  purple: '#8B5CF6'
}

// Dashboard refresh interval (in milliseconds)
export const DASHBOARD_REFRESH_INTERVAL = 30000 // 30 seconds

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 100
}