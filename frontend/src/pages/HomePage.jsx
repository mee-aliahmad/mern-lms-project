import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaGraduationCap, FaChalkboardTeacher, FaUserShield, FaRocket, FaBook, FaCertificate } from 'react-icons/fa';

/**
 * Home Page — Landing page with hero section, features, and CTA.
 * Only visible to unauthenticated users (wrapped in GuestRoute).
 * Uses useNavigate for all button navigation.
 */
const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaBook size={40} />,
      title: 'Rich Course Library',
      desc: 'Access hundreds of courses across various categories from industry experts.',
    },
    {
      icon: <FaChalkboardTeacher size={40} />,
      title: 'Expert Instructors',
      desc: 'Learn from experienced professionals who bring real-world expertise.',
    },
    {
      icon: <FaCertificate size={40} />,
      title: 'Track Progress',
      desc: 'Monitor your learning journey and track progress in real-time.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Courses' },
    { value: '10K+', label: 'Students' },
    { value: '200+', label: 'Instructors' },
    { value: '95%', label: 'Satisfaction' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={7} className="text-center text-lg-start">
              <div className="hero-badge mb-3">
                <FaRocket className="me-2" /> #1 Online Learning Platform
              </div>
              <h1 className="hero-title">
                Unlock Your <span className="gradient-text">Potential</span> With World-Class Learning
              </h1>
              <p className="hero-subtitle">
                Join thousands of learners and advance your career with expert-led courses.
                Learn at your own pace, anytime, anywhere.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  className="btn-glow px-5"
                  onClick={() => navigate('/courses')}
                >
                  Explore Courses
                </Button>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="px-4 py-2"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </div>
            </Col>
            <Col lg={5} className="d-none d-lg-block text-center">
              <div className="hero-illustration">
                <FaGraduationCap size={200} className="text-primary opacity-75" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <Container>
          <Row>
            {stats.map((stat, idx) => (
              <Col xs={6} md={3} key={idx} className="text-center mb-3 mb-md-0">
                <h2 className="fw-bold gradient-text mb-0">{stat.value}</h2>
                <p className="text-muted mb-0">{stat.label}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose <span className="gradient-text">LearnHub</span>?</h2>
            <p className="text-muted">Everything you need to accelerate your learning</p>
          </div>
          <Row>
            {features.map((feature, idx) => (
              <Col md={4} key={idx} className="mb-4">
                <Card className="feature-card h-100 text-center p-4">
                  <Card.Body>
                    <div className="feature-icon mb-3 text-primary">{feature.icon}</div>
                    <Card.Title className="fw-bold">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.desc}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Roles Section */}
      <section className="roles-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Built for <span className="gradient-text">Everyone</span></h2>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="role-card h-100 p-4 text-center">
                <Card.Body>
                  <FaGraduationCap size={48} className="text-info mb-3" />
                  <Card.Title className="fw-bold">Students</Card.Title>
                  <Card.Text className="text-muted">
                    Browse courses, enroll, track your progress, and advance your skills.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="role-card h-100 p-4 text-center">
                <Card.Body>
                  <FaChalkboardTeacher size={48} className="text-success mb-3" />
                  <Card.Title className="fw-bold">Instructors</Card.Title>
                  <Card.Text className="text-muted">
                    Create and manage courses, upload lessons, and reach students worldwide.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="role-card h-100 p-4 text-center">
                <Card.Body>
                  <FaUserShield size={48} className="text-warning mb-3" />
                  <Card.Title className="fw-bold">Admins</Card.Title>
                  <Card.Text className="text-muted">
                    Manage the entire platform, monitor analytics, and oversee users & courses.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 text-center">
        <Container>
          <h2 className="fw-bold mb-3">Ready to Start Learning?</h2>
          <p className="text-muted mb-4">Join our community and begin your learning journey today.</p>
          <Button
            variant="primary"
            size="lg"
            className="btn-glow px-5"
            onClick={() => navigate('/register')}
          >
            Sign Up for Free
          </Button>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
