import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaGraduationCap, FaChartLine, FaArrowRight, FaSearch } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Student Dashboard — View enrolled courses and progress
 */
const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await API.get('/enroll/my-courses');
      setEnrollments(data.data);
    } catch (error) {
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <div className="mb-4">
        <h2 className="fw-bold">Welcome back, <span className="gradient-text">{user?.name}</span>!</h2>
        <p className="text-muted">Here's your learning dashboard</p>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                <FaBook size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">{enrollments.length}</h4>
                <small className="text-muted">Enrolled Courses</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-success bg-opacity-10 text-success">
                <FaGraduationCap size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">
                  {enrollments.filter((e) => e.progress === 100).length}
                </h4>
                <small className="text-muted">Completed</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="dashboard-stat-card p-3">
            <Card.Body className="d-flex align-items-center gap-3">
              <div className="stat-icon bg-warning bg-opacity-10 text-warning">
                <FaChartLine size={24} />
              </div>
              <div>
                <h4 className="mb-0 fw-bold">
                  {enrollments.length > 0
                    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
                    : 0}%
                </h4>
                <small className="text-muted">Average Progress</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Enrolled Courses */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">My Courses</h4>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => navigate('/courses')}
        >
          <FaSearch className="me-1" /> Browse More Courses
        </Button>
      </div>

      {enrollments.length === 0 ? (
        <Card className="text-center p-5">
          <FaBook size={50} className="text-muted mb-3 mx-auto" />
          <h5 className="text-muted">No courses yet</h5>
          <p className="text-muted">Browse our catalog and start learning!</p>
          <Button
            variant="primary"
            className="mx-auto px-4"
            onClick={() => navigate('/courses')}
          >
            Explore Courses
          </Button>
        </Card>
      ) : (
        <Row>
          {enrollments.map((enrollment) => (
            <Col md={6} lg={4} key={enrollment._id} className="mb-4">
              <Card
                className="course-card h-100"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/courses/${enrollment.course?._id}`)}
              >
                <div className="course-card-header">
                  <FaBook size={40} className="course-card-icon" />
                </div>
                <Card.Body>
                  <Badge bg="primary" className="mb-2">{enrollment.course?.category}</Badge>
                  <Card.Title className="fw-bold">{enrollment.course?.title}</Card.Title>
                  <p className="text-muted small">
                    By {enrollment.course?.instructor?.name || 'Unknown'}
                  </p>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small mb-1">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <ProgressBar
                      now={enrollment.progress}
                      variant={enrollment.progress === 100 ? 'success' : 'primary'}
                      animated={enrollment.progress < 100}
                    />
                  </div>
                  <Button
                    variant={enrollment.progress === 100 ? 'success' : 'outline-primary'}
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/courses/${enrollment.course?._id}`);
                    }}
                  >
                    {enrollment.progress === 100 ? (
                      <><FaGraduationCap className="me-1" /> Completed</>
                    ) : (
                      <><FaArrowRight className="me-1" /> Continue Learning</>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default StudentDashboard;
