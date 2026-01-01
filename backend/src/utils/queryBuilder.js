// Query builder utility for MongoDB queries

export const buildJobFilters = (query) => {
    const filters = {};

    // Text search
    if (query.search) {
        filters.$text = { $search: query.search };
    }

    // Location filter
    if (query.location) {
        filters.location = { $regex: query.location, $options: 'i' };
    }

    // Job type filter
    if (query.jobType) {
        filters.jobType = query.jobType;
    }

    // Work mode filter
    if (query.workMode) {
        filters.workMode = query.workMode;
    }

    // Category filter
    if (query.category) {
        filters.category = query.category;
    }

    // Skills filter (match any skill)
    if (query.skills) {
        const skillsArray = Array.isArray(query.skills) ? query.skills : query.skills.split(',');
        filters.skills = { $in: skillsArray };
    }

    // Salary range filter
    if (query.salaryMin || query.salaryMax) {
        filters['salary.min'] = {};
        if (query.salaryMin && !isNaN(parseInt(query.salaryMin))) {
            filters['salary.min'].$gte = parseInt(query.salaryMin);
        }
        if (query.salaryMax && !isNaN(parseInt(query.salaryMax))) {
            filters['salary.max'] = {};
            filters['salary.max'].$lte = parseInt(query.salaryMax);
        }
        // Clean up empty objects
        if (Object.keys(filters['salary.min']).length === 0) delete filters['salary.min'];
    }

    // Experience range filter
    if (query.experienceMin !== undefined || query.experienceMax !== undefined) {
        const expMin = parseInt(query.experienceMin);
        const expMax = parseInt(query.experienceMax);

        if (!isNaN(expMin)) {
            filters['experience.min'] = { $lte: expMin };
        }
        if (!isNaN(expMax)) {
            filters['experience.max'] = { $gte: expMax };
        }
    }

    // Company filter
    if (query.company) {
        filters.company = query.company;
    }

    // Source filter (internal/external)
    if (query.source) {
        filters.source = query.source;
    }

    // External jobs filter
    if (query.isExternal !== undefined) {
        filters.isExternal = query.isExternal === 'true';
    }

    // Status filter (default to active for candidates)
    if (query.status) {
        filters.status = query.status;
    } else {
        // Default: only show approved and active jobs
        filters.isApproved = true;
        filters.status = 'active';
    }

    // Posted date filter (jobs posted in last N days)
    if (query.postedInDays) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(query.postedInDays));
        filters.createdAt = { $gte: daysAgo };
    }

    return filters;
};

export const buildExternalJobFilters = (query) => {
    const filters = { isActive: true };

    // Text search
    if (query.search) {
        filters.$text = { $search: query.search };
    }

    // Location filter
    if (query.location) {
        filters.location = { $regex: query.location, $options: 'i' };
    }

    // Job type filter
    if (query.jobType) {
        filters.jobType = query.jobType;
    }

    // Work mode filter
    if (query.workMode) {
        filters.workMode = query.workMode;
    }

    // Skills filter
    if (query.skills) {
        const skillsArray = Array.isArray(query.skills) ? query.skills : query.skills.split(',');
        filters.skills = { $in: skillsArray };
    }

    // Source filter
    if (query.source) {
        filters.source = query.source;
    }

    // Company filter
    if (query.company) {
        filters.company = { $regex: query.company, $options: 'i' };
    }

    // Posted date filter
    if (query.postedInDays) {
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(query.postedInDays));
        filters.postedDate = { $gte: daysAgo };
    }

    return filters;
};

export const buildPagination = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export const buildSort = (query) => {
    const sortOptions = {};

    if (query.sortBy) {
        const sortField = query.sortBy;
        const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
        sortOptions[sortField] = sortOrder;
    } else {
        // Default sort by creation date (newest first)
        sortOptions.createdAt = -1;
    }

    return sortOptions;
};

export const buildTextSearch = (searchTerm) => {
    if (!searchTerm) return {};

    return {
        $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { requirements: { $regex: searchTerm, $options: 'i' } },
            { skills: { $in: [new RegExp(searchTerm, 'i')] } },
        ],
    };
};
