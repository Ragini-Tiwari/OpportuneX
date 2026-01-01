import Joi from 'joi';
import {
    USER_ROLES,
    JOB_TYPES,
    WORK_MODES,
    JOB_CATEGORIES,
    APPLICATION_STATUS,
    ALERT_FREQUENCY,
    COMPANY_SIZES,
    PREP_RESOURCE_TYPES,
    DIFFICULTY_LEVELS,
    AVAILABILITY_STATUS,
} from './constants.js';

// User validation schemas
export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    role: Joi.string()
        .valid(...Object.values(USER_ROLES))
        .default(USER_ROLES.CANDIDATE),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    company: Joi.string().max(200),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    location: Joi.string().max(200),
    bio: Joi.string().max(500),
    skills: Joi.array().items(Joi.string()),
    experience: Joi.number().min(0).max(50),
});

// Profile validation
export const profileSchema = Joi.object({
    headline: Joi.string().max(200),
    summary: Joi.string().max(2000),
    education: Joi.array().items(
        Joi.object({
            degree: Joi.string().required(),
            institution: Joi.string().required(),
            field: Joi.string(),
            startYear: Joi.number().min(1950).max(2100),
            endYear: Joi.number().min(1950).max(2100),
            current: Joi.boolean(),
        })
    ),
    workExperience: Joi.array().items(
        Joi.object({
            company: Joi.string().required(),
            title: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date(),
            current: Joi.boolean(),
            description: Joi.string().max(1000),
        })
    ),
    certifications: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            issuer: Joi.string().required(),
            date: Joi.date(),
            url: Joi.string().uri(),
        })
    ),
    projects: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            description: Joi.string().max(1000),
            technologies: Joi.array().items(Joi.string()),
            url: Joi.string().uri(),
            startDate: Joi.date(),
            endDate: Joi.date(),
        })
    ),
    socialLinks: Joi.object({
        linkedin: Joi.string().uri(),
        github: Joi.string().uri(),
        portfolio: Joi.string().uri(),
        twitter: Joi.string().uri(),
    }),
    availability: Joi.string().valid(...Object.values(AVAILABILITY_STATUS)),
    preferredRoles: Joi.array().items(Joi.string()),
});

// Job validation
export const createJobSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    company: Joi.string().required(), // Company ObjectId
    description: Joi.string().min(50).required(),
    requirements: Joi.string().min(20).required(),
    location: Joi.string().required(),
    jobType: Joi.string()
        .valid(...Object.values(JOB_TYPES))
        .required(),
    workMode: Joi.string()
        .valid(...Object.values(WORK_MODES))
        .required(),
    salary: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string().default('USD'),
    }),
    skills: Joi.array().items(Joi.string()).min(1).required(),
    experience: Joi.object({
        min: Joi.number().min(0).default(0),
        max: Joi.number().min(0),
    }),
    category: Joi.string().valid(...Object.values(JOB_CATEGORIES)),
    applicationDeadline: Joi.date().min('now'),
    benefits: Joi.array().items(Joi.string()),
});

export const updateJobSchema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(50),
    requirements: Joi.string().min(20),
    location: Joi.string(),
    jobType: Joi.string().valid(...Object.values(JOB_TYPES)),
    workMode: Joi.string().valid(...Object.values(WORK_MODES)),
    salary: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
        currency: Joi.string(),
    }),
    skills: Joi.array().items(Joi.string()),
    experience: Joi.object({
        min: Joi.number().min(0),
        max: Joi.number().min(0),
    }),
    category: Joi.string().valid(...Object.values(JOB_CATEGORIES)),
    applicationDeadline: Joi.date(),
    benefits: Joi.array().items(Joi.string()),
});

// Application validation
export const createApplicationSchema = Joi.object({
    job: Joi.string().required(), // Job ObjectId
    resume: Joi.string().uri().required(),
    coverLetter: Joi.string().max(2000),
});

export const updateApplicationStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(APPLICATION_STATUS))
        .required(),
    notes: Joi.string().max(1000),
    interviewDate: Joi.date(),
    offerDetails: Joi.object({
        salary: Joi.number(),
        joiningDate: Joi.date(),
        otherDetails: Joi.string(),
    }),
    rejectionReason: Joi.string().max(500),
});

// Company validation
export const createCompanySchema = Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(50).max(5000).required(),
    industry: Joi.string().required(),
    size: Joi.string().valid(...Object.values(COMPANY_SIZES)),
    website: Joi.string().uri(),
    logo: Joi.string().uri(),
    location: Joi.string().required(),
    locations: Joi.array().items(Joi.string()),
    foundedYear: Joi.number().min(1800).max(new Date().getFullYear()),
    socialLinks: Joi.object({
        linkedin: Joi.string().uri(),
        twitter: Joi.string().uri(),
        facebook: Joi.string().uri(),
    }),
});

// Alert validation
export const createAlertSchema = Joi.object({
    frequency: Joi.string()
        .valid(...Object.values(ALERT_FREQUENCY))
        .default(ALERT_FREQUENCY.DAILY),
    criteria: Joi.object({
        skills: Joi.array().items(Joi.string()),
        locations: Joi.array().items(Joi.string()),
        jobTypes: Joi.array().items(Joi.string().valid(...Object.values(JOB_TYPES))),
        salaryMin: Joi.number().min(0),
        experienceRange: Joi.object({
            min: Joi.number().min(0),
            max: Joi.number().min(0),
        }),
    }).required(),
});

// Prep Resource validation
export const createPrepResourceSchema = Joi.object({
    type: Joi.string()
        .valid(...Object.values(PREP_RESOURCE_TYPES))
        .required(),
    title: Joi.string().min(5).max(300).required(),
    content: Joi.string().min(50).required(),
    category: Joi.string().required(),
    difficulty: Joi.string().valid(...Object.values(DIFFICULTY_LEVELS)),
    company: Joi.string(),
    tags: Joi.array().items(Joi.string()),
});

// Validation middleware
export const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors,
            });
        }

        req.body = value;
        next();
    };
};
