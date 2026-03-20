import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Login Page — Email/password login form
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const user = await login(formData);
      toast.success(`Welcome back, ${user.name}!`);

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
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <FaSignInAlt size={40} className="text-primary mb-2" />
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to continue your learning journey</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginEmail">
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

                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
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
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Form>

              <hr />
              <p className="text-center text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary fw-semibold">
                  Sign Up
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
