import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import ProfilePage from './pages/student/ProfilePage';

// Instructor Pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCoursePage from './pages/instructor/CreateCoursePage';
import ManageCoursesPage from './pages/instructor/ManageCoursesPage';
import EditCoursePage from './pages/instructor/EditCoursePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import AdminManageCoursesPage from './pages/admin/AdminManageCoursesPage';

/**
 * Main App component with strict role-based routing.
 *
 * Route types:
 * 1. GuestRoute — Only for unauthenticated users (Home, About, Login, Register)
 * 2. Open routes — Accessible by everyone (Courses listing, Course detail)
 * 3. ProtectedRoute — Only for authenticated users with the correct role
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper d-flex flex-column min-vh-100">
          <Navbar />

          <main className="flex-grow-1">
            <Routes>
              {/* ===== Guest-Only Routes (redirect to dashboard if logged in) ===== */}
              <Route path="/" element={<GuestRoute><HomePage /></GuestRoute>} />
              <Route path="/about" element={<GuestRoute><AboutPage /></GuestRoute>} />
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

              {/* ===== Open Routes (accessible by ALL users, logged in or not) ===== */}
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />

              {/* ===== Student Routes ===== */}
              <Route
                path="/student/dashboard"
                element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>}
              />
              <Route
                path="/student/my-courses"
                element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>}
              />
              <Route
                path="/student/profile"
                element={<ProtectedRoute roles={['student']}><ProfilePage /></ProtectedRoute>}
              />

              {/* ===== Instructor Routes ===== */}
              <Route
                path="/instructor/dashboard"
                element={<ProtectedRoute roles={['instructor']}><InstructorDashboard /></ProtectedRoute>}
              />
              <Route
                path="/instructor/create-course"
                element={<ProtectedRoute roles={['instructor']}><CreateCoursePage /></ProtectedRoute>}
              />
              <Route
                path="/instructor/manage-courses"
                element={<ProtectedRoute roles={['instructor']}><ManageCoursesPage /></ProtectedRoute>}
              />
              <Route
                path="/instructor/edit-course/:id"
                element={<ProtectedRoute roles={['instructor']}><EditCoursePage /></ProtectedRoute>}
              />

              {/* ===== Admin Routes ===== */}
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/manage-users"
                element={<ProtectedRoute roles={['admin']}><ManageUsersPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/manage-courses"
                element={<ProtectedRoute roles={['admin']}><AdminManageCoursesPage /></ProtectedRoute>}
              />
              <Route
                path="/admin/analytics"
                element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>}
              />

              {/* ===== Catch-all: redirect to home ===== */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>

        {/* Toast notification container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
