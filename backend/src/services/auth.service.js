import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { AuthenticationError, ConflictError } from "../utils/errorHandler.js";

export const registerUser = async (userData) => {
    const { email } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError("User already exists with this email");
    }

    // Create user
    const user = await User.create(userData);

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

export const loginUser = async (email, password) => {
    // Check if user exists (include password for comparison)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new AuthenticationError("Invalid credentials");
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new AuthenticationError("Invalid credentials");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        accessToken,
        refreshToken,
    };
};

export const refreshUserToken = async (token) => {
    // Find user with this refresh token
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
        throw new AuthenticationError("Invalid refresh token");
    }

    // Generate new tokens
    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const updateProfile = async (userId, profileData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError("User");
    }

    // Update only allowed fields
    const allowedFields = ["name", "phone", "location", "bio", "skills", "experience", "education", "jobPreferences"];
    allowedFields.forEach((field) => {
        if (profileData[field] !== undefined) {
            user[field] = profileData[field];
        }
    });

    await user.save();
    return user;
};

export const clearRefreshToken = async (userId) => {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};
