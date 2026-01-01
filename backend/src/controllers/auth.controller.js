import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { ValidationError } from "../utils/errorHandler.js";

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        // Validate request body
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        const { user, accessToken, refreshToken } = await authService.registerUser(value);

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, cookieOptions);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user,
                token: accessToken, // Sending access token in response for frontend store
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            throw new ValidationError(error.details[0].message);
        }

        const { user, accessToken, refreshToken } = await authService.loginUser(value.email, value.password);

        // Set refresh token in cookie
        res.cookie("refreshToken", refreshToken, cookieOptions);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user,
                token: accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ success: false, message: "Refresh token missing" });
        }

        const { accessToken, refreshToken: newRefreshToken } = await authService.refreshUserToken(token);

        // Set new refresh token in cookie
        res.cookie("refreshToken", newRefreshToken, cookieOptions);

        res.status(200).json({
            success: true,
            data: {
                token: accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
    try {
        const user = await authService.updateProfile(req.user.id, req.body);

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        // User is already attached to req by protect middleware
        res.status(200).json({
            success: true,
            data: req.user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        await authService.clearRefreshToken(req.user.id);
        res.clearCookie("refreshToken");
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
