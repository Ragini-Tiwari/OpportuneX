import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Recruiter Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post-job"
              element={
                <ProtectedRoute allowedRoles={["recruiter", "admin"]}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 OpportuneX. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
