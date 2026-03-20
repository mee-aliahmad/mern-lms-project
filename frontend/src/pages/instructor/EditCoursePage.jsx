import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaPlus, FaTrash, FaArrowLeft } from 'react-icons/fa';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Edit Course Page — Update course details and manage lessons
 */
const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    price: 0,
  });
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Design', 'Business', 'Other',
  ];

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      const course = data.data;
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        price: course.price,
      });
      setLessons(course.lessons || []);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/instructor/manage-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

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
    setSaving(true);

    try {
      const validLessons = lessons.filter((l) => l.title && l.content);
      await API.put(`/courses/${id}`, {
        ...formData,
        price: Number(formData.price),
        lessons: validLessons,
      });
      toast.success('Course updated successfully!');
      navigate('/instructor/manage-courses');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update course';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <Button variant="outline-secondary" className="mb-3" onClick={() => navigate(-1)}>
        <FaArrowLeft className="me-2" /> Back
      </Button>

      <h2 className="fw-bold mb-4">Edit <span className="gradient-text">Course</span></h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Card className="p-4 mb-4">
          <h5 className="fw-bold mb-3">Course Details</h5>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Course Title *</Form.Label>
                <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price ($)</Form.Label>
            <Form.Control type="number" name="price" min="0" step="0.01" value={formData.price} onChange={handleChange} />
          </Form.Group>
        </Card>

        <Card className="p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Lessons</h5>
            <Button variant="outline-primary" size="sm" onClick={addLesson}>
              <FaPlus className="me-1" /> Add Lesson
            </Button>
          </div>
          {lessons.length === 0 ? (
            <p className="text-muted text-center py-3">No lessons yet.</p>
          ) : (
            lessons.map((lesson, idx) => (
              <Card key={idx} className="p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Lesson {idx + 1}</strong>
                  <Button variant="outline-danger" size="sm" onClick={() => removeLesson(idx)}><FaTrash /></Button>
                </div>
                <Row>
                  <Col md={8}>
                    <Form.Control className="mb-2" type="text" placeholder="Lesson title" value={lesson.title} onChange={(e) => updateLesson(idx, 'title', e.target.value)} />
                  </Col>
                  <Col md={4}>
                    <Form.Control className="mb-2" type="text" placeholder="Duration" value={lesson.duration} onChange={(e) => updateLesson(idx, 'duration', e.target.value)} />
                  </Col>
                </Row>
                <Form.Control as="textarea" rows={2} placeholder="Lesson content" value={lesson.content} onChange={(e) => updateLesson(idx, 'content', e.target.value)} />
              </Card>
            ))
          )}
        </Card>

        <Button type="submit" variant="primary" size="lg" className="btn-glow" disabled={saving}>
          {saving ? 'Saving...' : 'Update Course'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditCoursePage;
