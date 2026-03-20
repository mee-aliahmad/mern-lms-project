import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button, Badge, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaPlus } from 'react-icons/fa';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Manage Courses Page — Instructor can view, edit, and delete their courses
 */
const ManageCoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get('/courses');
      const myCourses = data.data.filter((c) => c.instructor?._id === user._id);
      setCourses(myCourses);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/courses/${selectedCourse._id}`);
      setCourses(courses.filter((c) => c._id !== selectedCourse._id));
      toast.success('Course deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Manage <span className="gradient-text">Courses</span></h2>
        <Link to="/instructor/create-course" className="btn btn-primary">
          <FaPlus className="me-2" /> New Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center p-5">
          <h5 className="text-muted">No courses created yet</h5>
          <p className="text-muted">Start by creating your first course.</p>
          <Link to="/instructor/create-course" className="btn btn-primary mx-auto">
            Create Course
          </Link>
        </Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Lessons</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id}>
                    <td className="fw-semibold">{course.title}</td>
                    <td><Badge bg="primary">{course.category}</Badge></td>
                    <td>{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                    <td>{course.lessons?.length || 0}</td>
                    <td>{course.enrollmentCount || 0}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/courses/${course._id}`} className="btn btn-sm btn-outline-info">
                          <FaEye />
                        </Link>
                        <Link to={`/instructor/edit-course/${course._id}`} className="btn btn-sm btn-outline-warning">
                          <FaEdit />
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setShowDeleteModal(true);
                          }}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedCourse?.title}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete Course
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageCoursesPage;
