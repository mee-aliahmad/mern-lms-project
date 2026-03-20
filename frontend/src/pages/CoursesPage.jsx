import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup, Badge } from 'react-bootstrap';
import { FaSearch, FaBook, FaUser, FaDollarSign } from 'react-icons/fa';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Courses Page — Browse all courses with search & category filter
 */
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = [
    'All',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Design',
    'Business',
    'Other',
  ];

  useEffect(() => {
    fetchCourses();
  }, [search, category]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const { data } = await API.get('/courses', { params });
      setCourses(data.data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  const [searchTimeout, setSearchTimeout] = useState(null);
  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(
      setTimeout(() => {
        setSearch(value);
      }, 400)
    );
  };

  if (loading && courses.length === 0) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Explore <span className="gradient-text">Courses</span></h1>
        <p className="text-muted">Discover courses tailored to your interests</p>
      </div>

      {/* Search & Filter */}
      <Row className="mb-4">
        <Col md={8} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search courses..."
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-5">
          <FaBook size={60} className="text-muted mb-3" />
          <h4 className="text-muted">No courses found</h4>
          <p className="text-muted">Try adjusting your search or filter.</p>
        </div>
      ) : (
        <Row>
          {courses.map((course) => (
            <Col md={6} lg={4} key={course._id} className="mb-4">
              <Card className="course-card h-100">
                <div className="course-card-header">
                  <Badge bg="primary" className="position-absolute top-0 end-0 m-2">
                    {course.category}
                  </Badge>
                  <div className="course-card-icon">
                    <FaBook size={36} />
                  </div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{course.title}</Card.Title>
                  <Card.Text className="text-muted small flex-grow-1">
                    {course.description?.substring(0, 120)}
                    {course.description?.length > 120 ? '...' : ''}
                  </Card.Text>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="d-flex align-items-center gap-1 small text-muted">
                      <FaUser /> {course.instructor?.name || 'Unknown'}
                    </span>
                    <span className="fw-bold text-primary">
                      <FaDollarSign />{course.price === 0 ? 'Free' : course.price}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="btn btn-outline-primary mt-3 w-100"
                  >
                    View Course
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default CoursesPage;
