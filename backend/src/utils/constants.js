// Centralized constants for the application

export const USER_ROLES = {
    CANDIDATE: 'candidate',
    RECRUITER: 'recruiter',
    ADMIN: 'admin',
};

export const APPLICATION_STATUS = {
    APPLIED: 'applied',
    SHORTLISTED: 'shortlisted',
    INTERVIEW: 'interview',
    OFFER: 'offer',
    REJECTED: 'rejected',
};

export const JOB_TYPES = {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship',
};

export const WORK_MODES = {
    REMOTE: 'Remote',
    ONSITE: 'Onsite',
    HYBRID: 'Hybrid',
};

export const JOB_CATEGORIES = {
    ENGINEERING: 'Engineering',
    DESIGN: 'Design',
    MARKETING: 'Marketing',
    SALES: 'Sales',
    PRODUCT: 'Product',
    OPERATIONS: 'Operations',
    HR: 'HR',
    FINANCE: 'Finance',
    OTHER: 'Other',
};

export const JOB_STATUS = {
    ACTIVE: 'active',
    CLOSED: 'closed',
    DRAFT: 'draft',
    PENDING_APPROVAL: 'pending_approval',
};

export const JOB_SOURCES = {
    INTERNAL: 'internal',
    GREENHOUSE: 'greenhouse',
    LEVER: 'lever',
};

export const ALERT_FREQUENCY = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    INSTANT: 'instant',
};

export const ADMIN_ACTIONS = {
    USER_BLOCKED: 'user_blocked',
    USER_UNBLOCKED: 'user_unblocked',
    JOB_APPROVED: 'job_approved',
    JOB_REJECTED: 'job_rejected',
    SOURCE_ENABLED: 'source_enabled',
    SOURCE_DISABLED: 'source_disabled',
    USER_ROLE_CHANGED: 'user_role_changed',
    JOB_DELETED: 'job_deleted',
    COMPANY_VERIFIED: 'company_verified',
};

export const COMPANY_SIZES = {
    TINY: '1-10',
    SMALL: '11-50',
    MEDIUM: '51-200',
    LARGE: '201-500',
    XLARGE: '501-1000',
    ENTERPRISE: '1000+',
};

export const PREP_RESOURCE_TYPES = {
    DSA_ROADMAP: 'dsa_roadmap',
    INTERVIEW_QUESTION: 'interview_question',
    COMPANY_EXPERIENCE: 'company_experience',
};

export const DIFFICULTY_LEVELS = {
    EASY: 'Easy',
    MEDIUM: 'Medium',
    HARD: 'Hard',
};

export const AVAILABILITY_STATUS = {
    IMMEDIATE: 'immediate',
    TWO_WEEKS: '2_weeks',
    ONE_MONTH: '1_month',
    TWO_MONTHS: '2_months',
    NOT_LOOKING: 'not_looking',
};
