import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import JobSource from '../models/JobSource.js';
import PrepResource from '../models/PrepResource.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data (CAUTION: Only for development)
        if (process.env.NODE_ENV === 'development') {
            await User.deleteMany({});
            await Company.deleteMany({});
            await Job.deleteMany({});
            await JobSource.deleteMany({});
            await PrepResource.deleteMany({});
            console.log('🗑️  Cleared existing data');
        }

        // Create Admin User
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@opportunex.com',
            password: 'admin123',
            role: 'admin',
            isActive: true,
        });
        console.log('✅ Created admin user');

        // Create Sample Recruiter
        const recruiter = await User.create({
            name: 'John Recruiter',
            email: 'recruiter@techcorp.com',
            password: 'recruiter123',
            role: 'recruiter',
            isActive: true,
        });
        console.log('✅ Created recruiter user');

        // Create Sample Candidate
        const candidate = await User.create({
            name: 'Jane Candidate',
            email: 'candidate@example.com',
            password: 'candidate123',
            role: 'candidate',
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            experience: 3,
            location: 'San Francisco, CA',
            bio: 'Full-stack developer with 3 years of experience',
            isActive: true,
        });
        console.log('✅ Created candidate user');

        // Create Sample Companies
        const techCorp = await Company.create({
            name: 'TechCorp Inc.',
            description:
                'TechCorp is a leading technology company specializing in cloud solutions and enterprise software. We are committed to innovation and excellence.',
            industry: 'Technology',
            size: '501-1000',
            website: 'https://techcorp.example.com',
            location: 'San Francisco, CA',
            locations: ['San Francisco, CA', 'New York, NY', 'Austin, TX'],
            foundedYear: 2010,
            recruiters: [recruiter._id],
            isVerified: true,
            verifiedBy: admin._id,
            verifiedAt: new Date(),
            createdBy: recruiter._id,
        });

        const startupHub = await Company.create({
            name: 'StartupHub',
            description:
                'StartupHub is a fast-growing startup focused on revolutionizing the job search experience with AI-powered matching.',
            industry: 'Technology',
            size: '11-50',
            website: 'https://startuphub.example.com',
            location: 'Seattle, WA',
            locations: ['Seattle, WA'],
            foundedYear: 2020,
            recruiters: [],
            isVerified: false,
            createdBy: admin._id,
        });
        console.log('✅ Created sample companies');

        // Create Sample Jobs
        await Job.create({
            title: 'Senior Full-Stack Developer',
            company: techCorp._id,
            companyName: 'TechCorp Inc.',
            description:
                'We are looking for an experienced Full-Stack Developer to join our engineering team. You will work on building scalable web applications using modern technologies.',
            requirements:
                'Requirements: 5+ years of experience with JavaScript, React, Node.js, and MongoDB. Strong problem-solving skills and ability to work in a team.',
            location: 'San Francisco, CA',
            jobType: 'Full-time',
            workMode: 'Hybrid',
            salary: {
                min: 120000,
                max: 180000,
                currency: 'USD',
            },
            skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS'],
            experience: {
                min: 5,
                max: 10,
            },
            category: 'Engineering',
            postedBy: recruiter._id,
            status: 'active',
            isApproved: true,
            approvedBy: admin._id,
            approvedAt: new Date(),
            benefits: ['Health Insurance', 'Remote Work', '401k', 'Stock Options'],
        });

        await Job.create({
            title: 'Frontend Developer',
            company: startupHub._id,
            companyName: 'StartupHub',
            description:
                'Join our team as a Frontend Developer and help us build beautiful, responsive user interfaces.',
            requirements:
                'Requirements: 2+ years of experience with React, TypeScript, and CSS. Experience with modern frontend tools and frameworks.',
            location: 'Seattle, WA',
            jobType: 'Full-time',
            workMode: 'Remote',
            salary: {
                min: 80000,
                max: 120000,
                currency: 'USD',
            },
            skills: ['React', 'TypeScript', 'CSS', 'HTML', 'Tailwind'],
            experience: {
                min: 2,
                max: 5,
            },
            category: 'Engineering',
            postedBy: admin._id,
            status: 'pending_approval',
            isApproved: false,
            benefits: ['Health Insurance', 'Flexible Hours'],
        });

        await Job.create({
            title: 'Backend Engineer',
            company: techCorp._id,
            companyName: 'TechCorp Inc.',
            description:
                'We need a talented Backend Engineer to design and implement scalable APIs and microservices.',
            requirements:
                'Requirements: 3+ years of experience with Node.js, Express, PostgreSQL or MongoDB. Experience with Docker and Kubernetes is a plus.',
            location: 'New York, NY',
            jobType: 'Full-time',
            workMode: 'Onsite',
            salary: {
                min: 100000,
                max: 150000,
                currency: 'USD',
            },
            skills: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Kubernetes'],
            experience: {
                min: 3,
                max: 7,
            },
            category: 'Engineering',
            postedBy: recruiter._id,
            status: 'active',
            isApproved: true,
            approvedBy: admin._id,
            approvedAt: new Date(),
            benefits: ['Health Insurance', '401k', 'Gym Membership'],
        });
        console.log('✅ Created sample jobs');

        // Create Job Sources
        await JobSource.create({
            name: 'greenhouse',
            displayName: 'Greenhouse',
            isEnabled: false,
            apiConfig: {
                apiKey: '',
                apiUrl: 'https://boards-api.greenhouse.io/v1/boards/',
                boardToken: '',
            },
            jobsFetched: 0,
            lastJobCount: 0,
        });

        await JobSource.create({
            name: 'lever',
            displayName: 'Lever',
            isEnabled: false,
            apiConfig: {
                apiUrl: 'https://api.lever.co/v0/postings/',
                site: '',
            },
            jobsFetched: 0,
            lastJobCount: 0,
        });
        console.log('✅ Created job sources');

        // Create Sample Prep Resources
        await PrepResource.create({
            type: 'dsa_roadmap',
            title: 'Complete DSA Roadmap for Beginners',
            content: `
# DSA Roadmap

## Phase 1: Basics (2-3 weeks)
- Arrays and Strings
- Basic Math and Bit Manipulation
- Time and Space Complexity Analysis

## Phase 2: Intermediate (4-6 weeks)
- Linked Lists
- Stacks and Queues
- Recursion and Backtracking
- Trees and Binary Search Trees

## Phase 3: Advanced (6-8 weeks)
- Graphs (BFS, DFS, Shortest Path)
- Dynamic Programming
- Greedy Algorithms
- Advanced Trees (Segment Trees, Fenwick Trees)

## Phase 4: Practice (Ongoing)
- Solve 200+ problems on LeetCode
- Participate in contests
- Mock interviews
      `,
            category: 'Roadmap',
            difficulty: 'Medium',
            tags: ['DSA', 'Algorithms', 'Data Structures', 'Beginner'],
            createdBy: admin._id,
            isPublished: true,
        });

        await PrepResource.create({
            type: 'interview_question',
            title: 'Two Sum - Array Problem',
            content: `
# Two Sum

## Problem Statement
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

## Example
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

## Solution Approach
Use a hash map to store the complement of each number as you iterate through the array.

## Time Complexity
O(n)

## Space Complexity
O(n)
      `,
            category: 'Arrays',
            difficulty: 'Easy',
            tags: ['Arrays', 'Hash Map', 'Two Pointers'],
            createdBy: admin._id,
            isPublished: true,
        });

        await PrepResource.create({
            type: 'company_experience',
            title: 'Google Software Engineer Interview Experience',
            content: `
# Google SWE Interview Experience

## Round 1: Phone Screen (45 min)
- Two coding questions on arrays and strings
- Focus on optimal solutions and edge cases

## Round 2-5: Onsite (4 rounds)
- **Round 2:** Data Structures (Trees and Graphs)
- **Round 3:** Algorithms (Dynamic Programming)
- **Round 4:** System Design (Design a URL Shortener)
- **Round 5:** Behavioral (Leadership and Teamwork)

## Tips
- Practice LeetCode Medium/Hard problems
- Be ready to explain your thought process
- Ask clarifying questions
- Test your code thoroughly
      `,
            category: 'Interview Experience',
            company: 'Google',
            tags: ['Google', 'Interview', 'Software Engineer'],
            createdBy: admin._id,
            isPublished: true,
        });
        console.log('✅ Created sample prep resources');

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Admin: admin@opportunex.com / admin123');
        console.log('Recruiter: recruiter@techcorp.com / recruiter123');
        console.log('Candidate: candidate@example.com / candidate123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
