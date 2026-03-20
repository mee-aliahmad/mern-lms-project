import { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal } from 'react-bootstrap';
import { FaTrash, FaUsers } from 'react-icons/fa';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

/**
 * Manage Users Page — Admin can view all users and delete them
 */
const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/users/${selectedUser._id}`);
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    const variants = { admin: 'danger', instructor: 'success', student: 'primary' };
    return <Badge bg={variants[role] || 'secondary'} className="text-capitalize">{role}</Badge>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-5">
      <div className="d-flex align-items-center gap-2 mb-4">
        <FaUsers size={28} className="text-primary" />
        <h2 className="fw-bold mb-0">Manage <span className="gradient-text">Users</span></h2>
      </div>

      <Card>
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id}>
                  <td>{idx + 1}</td>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{getRoleBadge(u.role)}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user <strong>{selectedUser?.name}</strong> ({selectedUser?.email})?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete User</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsersPage;
