import Company from "../models/Company.js";
import { NotFoundError, AuthorizationError } from "../utils/errorHandler.js";

// @desc    Create company profile
// @route   POST /api/companies
// @access  Private (Recruiter/Admin)
export const createCompany = async (req, res) => {
    try {
        const company = await Company.create({
            ...req.body,
            createdBy: req.user.id,
            recruiters: [req.user.id],
        });

        res.status(201).json({
            success: true,
            data: company,
        });
    } catch (error) {
        console.error("Create company error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Recruiter owner/Admin)
export const updateCompany = async (req, res) => {
    try {
        let company = await Company.findById(req.params.id);

        if (!company) {
            throw new NotFoundError("Company");
        }

        // Check if user is a recruiter of this company or admin
        if (!company.recruiters.includes(req.user.id) && req.user.role !== "admin") {
            throw new AuthorizationError("Not authorized to update this company");
        }

        company = await Company.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            return res.status(error.statusCode || 400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get company details
// @route   GET /api/companies/:id
// @access  Public
export const getCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .populate("recruiters", "name email");

        if (!company) {
            throw new NotFoundError("Company");
        }

        res.status(200).json({
            success: true,
            data: company,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Get recruiter's companies
// @route   GET /api/companies/my
// @access  Private (Recruiter)
export const getMyCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ recruiters: req.user.id });

        res.status(200).json({
            success: true,
            data: companies,
            count: companies.length,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Add recruiter to company
// @route   POST /api/companies/:id/recruiters
// @access  Private (Recruiter owner/Admin)
export const addRecruiter = async (req, res) => {
    try {
        const { email } = req.body;
        const User = (await import("../models/User.js")).default;

        const recruiterUser = await User.findOne({ email, role: "recruiter" });
        if (!recruiterUser) {
            throw new NotFoundError("Recruiter user with this email");
        }

        const company = await Company.findById(req.params.id);
        if (!company) {
            throw new NotFoundError("Company");
        }

        if (company.recruiters.includes(recruiterUser._id)) {
            return res.status(400).json({ success: false, message: "User is already a recruiter for this company" });
        }

        company.recruiters.push(recruiterUser._id);
        await company.save();

        res.status(200).json({
            success: true,
            message: "Recruiter added successfully",
            data: company,
        });
    } catch (error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Server error" });
    }
};
