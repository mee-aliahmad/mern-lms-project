import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, Table, Button, Badge, Modal } from 'react-bootstrap';
import { FaTrash, FaEye, FaBook } from 'react-icons/fa';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Admin Manage Courses Page — View and delete any course on the platform
 */
const AdminManageCoursesPage = () => {
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
      setCourses(data.data);
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
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaBook size={28} className="text-primary" />
        <h2 className="fw-bold mb-0">Manage <span className="gradient-text">All Courses</span></h2>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center p-5">
          <h5 className="text-muted">No courses on the platform yet</h5>
        </Card>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={course._id}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{course.title}</td>
                    <td>{course.instructor?.name || 'N/A'}</td>
                    <td><Badge bg="primary">{course.category}</Badge></td>
                    <td>{course.price === 0 ? 'Free' : `$${course.price}`}</td>
                    <td>{course.enrollmentCount || 0}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/courses/${course._id}`} className="btn btn-sm btn-outline-info">
                          <FaEye />
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedCourse?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Course</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminManageCoursesPage;
