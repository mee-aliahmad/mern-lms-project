import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaSignOutAlt, FaUser, FaTachometerAlt, FaBook, FaPlus, FaCog, FaUsers, FaChartBar, FaIdCard } from 'react-icons/fa';

/**
 * Navigation bar with strict role-aware menu items.
 * - Authenticated users see ONLY their role-specific links.
 * - Guests see only public pages (Home, Courses, About, Login, Register).
 */
const Navbar = () => {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Renders role-specific navigation links
   */
  const renderRoleLinks = () => {
    switch (user?.role) {
      case 'student':
        return (
          <>
            <Nav.Link as={Link} to="/student/dashboard">
              <FaTachometerAlt className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/student/my-courses">
              <FaBook className="me-1" /> My Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/student/profile">
              <FaIdCard className="me-1" /> Profile
            </Nav.Link>
          </>
        );
      case 'instructor':
        return (
          <>
            <Nav.Link as={Link} to="/instructor/dashboard">
              <FaTachometerAlt className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/instructor/create-course">
              <FaPlus className="me-1" /> Create Course
            </Nav.Link>
            <Nav.Link as={Link} to="/instructor/manage-courses">
              <FaCog className="me-1" /> Manage Courses
            </Nav.Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Nav.Link as={Link} to="/admin/dashboard">
              <FaTachometerAlt className="me-1" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/manage-users">
              <FaUsers className="me-1" /> Users
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/manage-courses">
              <FaBook className="me-1" /> Courses
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/analytics">
              <FaChartBar className="me-1" /> Analytics
            </Nav.Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <BsNavbar expand="lg" className="navbar-glass" sticky="top">
      <Container>
        <BsNavbar.Brand
          as={Link}
          to={isAuthenticated ? getDashboardPath(user.role) : '/'}
          className="d-flex align-items-center gap-2 fw-bold"
        >
          <FaGraduationCap size={28} className="text-primary" />
          <span className="brand-text">LearnHub</span>
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-navbar" />
        <BsNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {isAuthenticated ? (
              /* Authenticated: show role-specific links */
              renderRoleLinks()
            ) : (
              /* Guest: show public links */
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="align-items-center">
            {isAuthenticated ? (
              <>
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center gap-1">
                      <FaUser /> {user.name}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to={getDashboardPath(user.role)}>
                    <FaTachometerAlt className="me-2" /> Dashboard
                  </NavDropdown.Item>
                  {user.role === 'student' && (
                    <NavDropdown.Item as={Link} to="/student/profile">
                      <FaIdCard className="me-2" /> Profile
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <span className="badge bg-primary ms-2 text-capitalize">
                  {user.role}
                </span>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <Button variant="outline-primary" size="sm" className="me-2">
                    Login
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
