import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaGraduationCap, FaBullseye, FaHeart, FaLightbulb } from 'react-icons/fa';

/**
 * About Page — Platform information and mission
 */
const AboutPage = () => {
  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <FaGraduationCap size={60} className="text-primary mb-3" />
        <h1 className="fw-bold">About <span className="gradient-text">LearnHub</span></h1>
        <p className="text-muted lead mx-auto" style={{ maxWidth: '600px' }}>
          We're on a mission to democratize education and make quality learning accessible to everyone, everywhere.
        </p>
      </div>

      {/* Values */}
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100 text-center p-4">
            <Card.Body>
              <FaBullseye size={40} className="text-primary mb-3" />
              <Card.Title className="fw-bold">Our Mission</Card.Title>
              <Card.Text className="text-muted">
                To provide high-quality, accessible education that empowers individuals to achieve their goals
                and transform their careers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100 text-center p-4">
            <Card.Body>
              <FaHeart size={40} className="text-danger mb-3" />
              <Card.Title className="fw-bold">Our Values</Card.Title>
              <Card.Text className="text-muted">
                We believe in continuous learning, community-driven growth, and making education
                inclusive for everyone regardless of background.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100 text-center p-4">
            <Card.Body>
              <FaLightbulb size={40} className="text-warning mb-3" />
              <Card.Title className="fw-bold">Our Vision</Card.Title>
              <Card.Text className="text-muted">
                To be the world's most trusted online learning platform where anyone can learn
                anything and advance their career.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Info */}
      <Row className="align-items-center">
        <Col md={6} className="mb-4">
          <h3 className="fw-bold">What Makes Us Different?</h3>
          <ul className="list-unstyled">
            <li className="mb-2">✅ Expert-curated courses by industry professionals</li>
            <li className="mb-2">✅ Self-paced learning with progress tracking</li>
            <li className="mb-2">✅ Role-based platform for students, instructors, and admins</li>
            <li className="mb-2">✅ Clean, modern, and responsive interface</li>
            <li className="mb-2">✅ Built with the latest MERN stack technology</li>
          </ul>
        </Col>
        <Col md={6} className="mb-4">
          <h3 className="fw-bold">Tech Stack</h3>
          <div className="d-flex flex-wrap gap-2">
            {['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Bootstrap'].map((tech) => (
              <span key={tech} className="badge bg-primary bg-opacity-10 text-primary p-2 px-3 rounded-pill">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-muted mt-3">
            LearnHub is a full-featured Learning Management System built with the MERN stack,
            featuring JWT authentication, role-based access control, and a modern responsive UI.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
