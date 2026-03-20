import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUsers, FaBook, FaGraduationCap, FaChalkboardTeacher, FaChartBar, FaUserPlus } from 'react-icons/fa';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

/**
 * Admin Dashboard — Platform analytics and overview
 */
const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await API.get('/users/analytics');
      setAnalytics(data.data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const stats = [
    { icon: <FaUsers size={24} />, value: analytics?.totalUsers || 0, label: 'Total Users', color: 'primary' },
    { icon: <FaGraduationCap size={24} />, value: analytics?.totalStudents || 0, label: 'Students', color: 'info' },
    { icon: <FaChalkboardTeacher size={24} />, value: analytics?.totalInstructors || 0, label: 'Instructors', color: 'success' },
    { icon: <FaBook size={24} />, value: analytics?.totalCourses || 0, label: 'Courses', color: 'warning' },
    { icon: <FaChartBar size={24} />, value: analytics?.totalEnrollments || 0, label: 'Enrollments', color: 'danger' },
    { icon: <FaUserPlus size={24} />, value: analytics?.recentUsers || 0, label: 'New Users (30d)', color: 'secondary' },
  ];

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">Admin <span className="gradient-text">Dashboard</span></h2>

      {/* Stats Grid */}
      <Row className="mb-4">
        {stats.map((stat, idx) => (
          <Col md={4} lg={2} key={idx} className="mb-3">
            <Card className="dashboard-stat-card p-3 text-center h-100">
              <Card.Body>
                <div className={`stat-icon bg-${stat.color} bg-opacity-10 text-${stat.color} mx-auto mb-2`}>
                  {stat.icon}
                </div>
                <h4 className="fw-bold mb-0">{stat.value}</h4>
                <small className="text-muted">{stat.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <h4 className="fw-bold mb-3">Quick Actions</h4>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Link to="/admin/manage-users" className="text-decoration-none">
            <Card className="feature-card p-4 text-center h-100">
              <FaUsers size={30} className="text-primary mb-2 mx-auto" />
              <h5 className="fw-bold">Manage Users</h5>
              <p className="text-muted small">View and manage all platform users</p>
            </Card>
          </Link>
        </Col>
        <Col md={4} className="mb-3">
          <Link to="/admin/manage-courses" className="text-decoration-none">
            <Card className="feature-card p-4 text-center h-100">
              <FaBook size={30} className="text-success mb-2 mx-auto" />
              <h5 className="fw-bold">Manage Courses</h5>
              <p className="text-muted small">View and manage all courses</p>
            </Card>
          </Link>
        </Col>
        <Col md={4} className="mb-3">
          <Link to="/courses" className="text-decoration-none">
            <Card className="feature-card p-4 text-center h-100">
              <FaChartBar size={30} className="text-warning mb-2 mx-auto" />
              <h5 className="fw-bold">Browse Courses</h5>
              <p className="text-muted small">View the public course catalog</p>
            </Card>
          </Link>
        </Col>
      </Row>

      {/* Top Courses */}
      {analytics?.topCourses && analytics.topCourses.length > 0 && (
        <>
          <h4 className="fw-bold mb-3">Top Courses by Enrollment</h4>
          <Card>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Instructor</th>
                    <th>Enrollments</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topCourses.map((course, idx) => (
                    <tr key={course._id}>
                      <td>{idx + 1}</td>
                      <td className="fw-semibold">{course.title}</td>
                      <td>{course.instructor?.name || 'N/A'}</td>
                      <td>{course.enrollmentCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </Container>
  );
};

export default AdminDashboard;
