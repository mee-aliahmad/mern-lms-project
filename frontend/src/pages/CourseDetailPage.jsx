import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Accordion, ProgressBar } from 'react-bootstrap';
import { FaUser, FaDollarSign, FaBook, FaClock, FaArrowLeft, FaCheckCircle, FaPlay, FaLock, FaArrowRight } from 'react-icons/fa';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Course Detail Page
 * - Guests / non-enrolled students: see course info + lesson titles (locked)
 * - Enrolled students: can expand lessons to read content + update progress
 */
const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    fetchCourse();
    if (isAuthenticated) checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data.data);
    } catch (error) {
      toast.error('Failed to load course');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await API.get('/enroll/my-courses');
      const found = data.data.find((e) => e.course?._id === id);
      if (found) {
        setEnrolled(true);
        setEnrollment(found);
      }
    } catch {
      // Silently fail
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to enroll');
      navigate('/login');
      return;
    }

    setEnrolling(true);
    try {
      const { data } = await API.post('/enroll', { courseId: id });
      setEnrolled(true);
      setEnrollment(data.data);
      toast.success('Successfully enrolled! You can now access all lessons.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    if (!enrollment) return;
    try {
      await API.put(`/enroll/${enrollment._id}`, { progress: newProgress });
      setEnrollment({ ...enrollment, progress: newProgress });
      if (newProgress === 100) {
        toast.success('🎉 Congratulations! You completed the course!');
      }
    } catch {
      toast.error('Failed to update progress');
    }
  };

  const handleLessonClick = (idx) => {
    if (!enrolled) {
      toast.info('Enroll in this course to access lessons');
      return;
    }
    setActiveLesson(activeLesson === idx ? null : idx);

    // Auto-update progress based on lessons viewed
    if (course?.lessons?.length > 0) {
      const progressPerLesson = Math.floor(100 / course.lessons.length);
      const newProgress = Math.min(100, progressPerLesson * (idx + 1));
      if (newProgress > (enrollment?.progress || 0)) {
        handleUpdateProgress(newProgress);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return null;

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft className="me-2" /> Back
      </Button>

      <Row>
        {/* Course Info + Lessons */}
        <Col lg={8} className="mb-4">
          <div className="mb-3">
            <Badge bg="primary" className="me-2">{course.category}</Badge>
            <Badge bg={course.price === 0 ? 'success' : 'warning'}>
              {course.price === 0 ? 'Free' : `$${course.price}`}
            </Badge>
          </div>

          <h1 className="fw-bold mb-3">{course.title}</h1>

          <div className="d-flex align-items-center gap-3 mb-4 text-muted flex-wrap">
            <span><FaUser className="me-1" /> {course.instructor?.name}</span>
            <span><FaBook className="me-1" /> {course.lessons?.length || 0} Lessons</span>
            <span><FaDollarSign className="me-1" /> {course.price === 0 ? 'Free' : `$${course.price}`}</span>
          </div>

          {/* Progress bar for enrolled students */}
          {enrolled && enrollment && (
            <Card className="mb-4 p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Your Progress</strong>
                <span className="text-primary fw-bold">{enrollment.progress}%</span>
              </div>
              <ProgressBar
                now={enrollment.progress}
                variant={enrollment.progress === 100 ? 'success' : 'primary'}
                animated={enrollment.progress < 100}
                style={{ height: '12px' }}
              />
              {enrollment.progress === 100 && (
                <div className="text-success text-center mt-2 fw-bold">
                  <FaCheckCircle className="me-1" /> Course Completed!
                </div>
              )}
            </Card>
          )}

          {/* About */}
          <Card className="mb-4 p-4">
            <h4 className="fw-bold mb-3">About This Course</h4>
            <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
              {course.description}
            </p>
          </Card>

          {/* Lessons — Expandable for enrolled students */}
          {course.lessons && course.lessons.length > 0 && (
            <Card className="p-4">
              <h4 className="fw-bold mb-3">
                <FaBook className="me-2 text-primary" />
                Course Content ({course.lessons.length} lessons)
              </h4>

              {enrolled ? (
                /* Enrolled: lessons are expandable with content */
                <Accordion activeKey={activeLesson !== null ? String(activeLesson) : null}>
                  {course.lessons.map((lesson, idx) => (
                    <Accordion.Item eventKey={String(idx)} key={idx} className="mb-2">
                      <Accordion.Header onClick={() => handleLessonClick(idx)}>
                        <div className="d-flex align-items-center gap-2 w-100 me-3">
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {idx + 1}
                          </span>
                          <span className="fw-semibold">{lesson.title}</span>
                          {lesson.duration && (
                            <span className="text-muted small ms-auto">
                              <FaClock className="me-1" />{lesson.duration}
                            </span>
                          )}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="lesson-content p-3" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                          {lesson.content}
                        </div>
                        {idx < course.lessons.length - 1 && (
                          <div className="text-end mt-3">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleLessonClick(idx + 1)}
                            >
                              Next Lesson <FaArrowRight className="ms-1" />
                            </Button>
                          </div>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                /* Not enrolled: show locked lesson list */
                <ListGroup variant="flush">
                  {course.lessons.map((lesson, idx) => (
                    <ListGroup.Item
                      key={idx}
                      className="d-flex justify-content-between align-items-center"
                      style={{ opacity: 0.7 }}
                    >
                      <span>
                        <span className="badge bg-primary bg-opacity-10 text-primary me-2">
                          {idx + 1}
                        </span>
                        {lesson.title}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        {lesson.duration && (
                          <span className="text-muted small">
                            <FaClock className="me-1" />{lesson.duration}
                          </span>
                        )}
                        <FaLock className="text-muted" size={12} />
                      </span>
                    </ListGroup.Item>
                  ))}
                  <div className="text-center mt-3 text-muted small">
                    <FaLock className="me-1" /> Enroll to unlock all lessons
                  </div>
                </ListGroup>
              )}
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          <Card className="p-4 sticky-top" style={{ top: '80px' }}>
            <div className="text-center mb-3">
              <h3 className="fw-bold text-primary">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </h3>
            </div>

            {enrolled ? (
              <>
                <Button variant="success" className="w-100 py-2 mb-2" disabled>
                  <FaCheckCircle className="me-2" /> Enrolled
                </Button>
                <Button
                  variant="primary"
                  className="w-100 py-2"
                  onClick={() => {
                    // Scroll to lessons and open first one
                    setActiveLesson(0);
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                  }}
                >
                  <FaPlay className="me-2" />
                  {enrollment?.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </>
            ) : user?.role === 'instructor' && course.instructor?._id === user._id ? (
              <Button variant="secondary" className="w-100 py-2" disabled>
                Your Course
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-100 py-2 btn-glow"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </Button>
            )}

            <hr />
            <div className="small text-muted">
              <p><strong>Instructor:</strong> {course.instructor?.name}</p>
              <p><strong>Category:</strong> {course.category}</p>
              <p><strong>Lessons:</strong> {course.lessons?.length || 0}</p>
              <p><strong>Enrolled:</strong> {course.enrollmentCount || 0} students</p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CourseDetailPage;
