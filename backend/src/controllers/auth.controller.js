import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";
import Joi from "joi";

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("candidate", "recruiter").default("candidate"),
    phone: Joi.string().optional(),
    company: Joi.string().optional(),
    location: Joi.string().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { name, email, password, role, phone, company, location } = value;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            company,
            location,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { email, password } = value;

        // Check if user exists (include password for comparison)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if password matches
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get me error:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
