import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaUsers } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Instructor Dashboard — Overview of instructor's courses
 */
const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      // Filter only courses created by this instructor
      const myCourses = data.data.filter(
        (c) => c.instructor?._id === user._id
      );
      setCourses(myCourses);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0);

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Instructor <span className="gradient-text">Dashboard</span></h2>
          <p className="text-muted">Welcome, {user?.name}</p>
        </div>
        <Link to="/instructor/create-course" className="btn btn-primary">
          <FaPlus className="me-2" /> Create Course
        </Link>
      </div>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <FaBook size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{courses.length}</h4>
                <small className="text-muted">My Courses</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <FaUsers size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{totalStudents}</h4>
                <small className="text-muted">Total Students</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-info bg-opacity-10 text-info">
                <FaBook size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">
                  {courses.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)}
                </h4>
                <small className="text-muted">Total Lessons</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <h4 className="fw-bold mb-3">Quick Actions</h4>
      <Row>
        <Col md={6} className="mb-3">
          <Link to="/instructor/create-course" className="text-decoration-none">
            <Card className="feature-card p-4 text-center">
              <FaPlus size={30} className="text-primary mb-2 mx-auto" />
              <h5 className="fw-bold">Create New Course</h5>
              <p className="text-muted small">Add a new course with lessons</p>
            </Card>
          </Link>
        </Col>
        <Col md={6} className="mb-3">
          <Link to="/instructor/manage-courses" className="text-decoration-none">
            <Card className="feature-card p-4 text-center">
              <FaBook size={30} className="text-success mb-2 mx-auto" />
              <h5 className="fw-bold">Manage Courses</h5>
              <p className="text-muted small">Edit or delete your existing courses</p>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorDashboard;
