# OpportuneX - Job Board Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) job board platform with role-based access control, secure authentication, and comprehensive job management features.

## 🚀 Features

### For Job Seekers (Candidates)
- Browse and search jobs with advanced filters
- View detailed job descriptions
- Apply to jobs with resume and cover letter
- Track application status

### For Recruiters
- Post and manage job listings
- View and manage applications
- Track application statistics
- Update application status

### For Administrators
- Full access to all features
- Manage users and jobs
- System-wide controls

## 🛠️ Technology Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security headers
- **Morgan** - Request logging

### Frontend
- **React 19** with **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Navigation
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - API calls
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend/my-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
OpportuneX/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Auth & other middlewares
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/
    └── my-app/
        ├── src/
        │   ├── components/  # Reusable components
        │   ├── pages/       # Page components
        │   ├── services/    # API services
        │   ├── store/       # Zustand stores
        │   ├── utils/       # Utilities
        │   ├── App.jsx      # Main app component
        │   └── main.jsx     # Entry point
        ├── package.json
        └── .env.example
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter/Admin)
- `PUT /api/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/jobs/:id` - Delete job (Recruiter/Admin)
- `GET /api/jobs/my/jobs` - Get recruiter's jobs (Recruiter/Admin)

### Applications
- `POST /api/applications` - Submit application (Candidate)
- `GET /api/applications/my` - Get user's applications (Candidate)
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter/Admin)
- `PUT /api/applications/:id/status` - Update application status (Recruiter/Admin)
- `DELETE /api/applications/:id` - Delete application (Candidate)

## 👥 User Roles

1. **Candidate** - Can browse jobs and apply
2. **Recruiter** - Can post jobs and manage applications
3. **Admin** - Full system access

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation with Joi
- Security headers with Helmet
- CORS configuration
- Protected routes

## 🎨 UI Features

- Responsive design
- Modern, clean interface
- Toast notifications
- Form validation
- Loading states
- Error handling
- Role-based navigation

## 🚀 Deployment

### Backend Deployment (Example: Render, Railway, Heroku)
1. Set environment variables
2. Deploy from Git repository
3. Ensure MongoDB connection string is set

### Frontend Deployment (Example: Vercel, Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set `VITE_API_URL` environment variable

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**OpportuneX** - Connecting talent with opportunity 🚀
