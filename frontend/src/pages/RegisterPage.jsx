import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Register Page — Sign-up form with role selection
 */
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...userData } = formData;
      const user = await register(userData);
      toast.success(`Welcome to LearnHub, ${user.name}!`);

      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'instructor':
          navigate('/instructor/dashboard');
          break;
        default:
          navigate('/student/dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={7} lg={5}>
          <Card className="auth-card p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <FaUserPlus size={40} className="text-primary mb-2" />
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join LearnHub and start learning today</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="regName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="regEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="regRole">
                  <Form.Label>I want to join as</Form.Label>
                  <Form.Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="instructor">Instructor</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="regPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a password (min 6 chars)"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="regConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-2 btn-glow"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Form>

              <hr />
              <p className="text-center text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold">
                  Sign In
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
