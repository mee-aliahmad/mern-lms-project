import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import API from '../../services/api';
import { toast } from 'react-toastify';

/**
 * Create Course Page — Form for instructors to create a new course with lessons
 */
const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: 0,
  });
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Other',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Lesson management
  const addLesson = () => {
    setLessons([...lessons, { title: '', content: '', duration: '' }]);
  };

  const updateLesson = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate lessons
    const validLessons = lessons.filter((l) => l.title && l.content);

    setLoading(true);
    try {
      await API.post('/courses', {
        ...formData,
        price: Number(formData.price),
        lessons: validLessons,
      });
      toast.success('Course created successfully!');
      navigate('/instructor/manage-courses');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create course';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </Button>

      <h2 className="fw-bold mb-4">Create <span className="gradient-text">New Course</span></h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="p-4 mb-4">
          <h5 className="fw-bold mb-3">Course Details</h5>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Course Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  placeholder="Enter course title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              placeholder="Enter course description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">Set to 0 for a free course</Form.Text>
          </Form.Group>
        </Card>

        {/* Lessons Section */}
        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Lessons</h5>
            <Button variant="outline-primary" size="sm" onClick={addLesson}>
              <FaPlus className="me-1" /> Add Lesson
            </Button>
          </div>

          {lessons.length === 0 ? (
            <p className="text-muted text-center py-3">
              No lessons added yet. Click "Add Lesson" to start adding content.
            </p>
          ) : (
            lessons.map((lesson, idx) => (
              <Card key={idx} className="p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Lesson {idx + 1}</strong>
                  <Button variant="outline-danger" size="sm" onClick={() => removeLesson(idx)}>
                    <FaTrash />
                  </Button>
                </div>
                <Row>
                  <Col md={8}>
                    <Form.Control
                      className="mb-2"
                      type="text"
                      placeholder="Lesson title"
                      value={lesson.title}
                      onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Control
                      className="mb-2"
                      type="text"
                      placeholder="Duration (e.g., 10 mins)"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(idx, 'duration', e.target.value)}
                    />
                  </Col>
                </Row>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Lesson content"
                  value={lesson.content}
                  onChange={(e) => updateLesson(idx, 'content', e.target.value)}
                />
              </Card>
            ))
          )}
        </Card>

        <Button type="submit" variant="primary" size="lg" className="btn-glow" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCoursePage;
