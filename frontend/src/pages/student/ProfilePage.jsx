import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Modal, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaShieldAlt, FaEdit, FaLock, FaCalendarAlt, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

/**
 * Profile Page — Modern UI with avatar, user details, and edit functionality
 */
const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const openEditModal = () => {
    setEditData({ name: user?.name || '', currentPassword: '', newPassword: '', confirmPassword: '' });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    // Validate
    if (!editData.name.trim()) {
      setEditError('Name is required');
      return;
    }

    if (editData.newPassword) {
      if (editData.newPassword.length < 6) {
        setEditError('New password must be at least 6 characters');
        return;
      }
      if (editData.newPassword !== editData.confirmPassword) {
        setEditError('New passwords do not match');
        return;
      }
      if (!editData.currentPassword) {
        setEditError('Current password is required to change password');
        return;
      }
    }

    setSaving(true);
    try {
      const payload = { name: editData.name };
      if (editData.newPassword) {
        payload.password = editData.newPassword;
        payload.currentPassword = editData.currentPassword;
      }

      await updateProfile(payload);
      toast.success('Profile updated successfully!');
      setShowEditModal(false);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setEditError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4">My <span className="gradient-text">Profile</span></h2>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          {/* Profile Header Card */}
          <Card className="profile-header-card mb-4 overflow-hidden">
            <div className="profile-banner" />
            <Card.Body className="text-center position-relative" style={{ marginTop: '-60px' }}>
              {/* Avatar */}
              <div className="profile-avatar mx-auto mb-3">
                <span className="profile-avatar-text">{getInitials(user?.name)}</span>
              </div>

              <h3 className="fw-bold mb-1">{user?.name}</h3>
              <p className="text-muted mb-2">{user?.email}</p>
              <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill text-capitalize fs-6">
                {user?.role}
              </span>

              <div className="mt-4">
                <Button variant="primary" className="btn-glow px-4" onClick={openEditModal}>
                  <FaEdit className="me-2" /> Edit Profile
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Details Cards */}
          <Row>
            <Col md={6} className="mb-4">
              <Card className="profile-detail-card h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="profile-detail-icon bg-primary bg-opacity-10">
                    <FaUser className="text-primary" size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Full Name</small>
                    <strong className="fs-5">{user?.name}</strong>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="profile-detail-card h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="profile-detail-icon bg-info bg-opacity-10">
                    <FaEnvelope className="text-info" size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Email Address</small>
                    <strong className="fs-5">{user?.email}</strong>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="profile-detail-card h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="profile-detail-icon bg-success bg-opacity-10">
                    <FaShieldAlt className="text-success" size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Account Role</small>
                    <strong className="fs-5 text-capitalize">{user?.role}</strong>
                  </div>
                </div>
              </Card>
            </Col>

            <Col md={6} className="mb-4">
              <Card className="profile-detail-card h-100 p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="profile-detail-icon bg-warning bg-opacity-10">
                    <FaCalendarAlt className="text-warning" size={20} />
                  </div>
                  <div>
                    <small className="text-muted d-block">Account Status</small>
                    <strong className="fs-5">
                      <span className="badge bg-success">Active</span>
                    </strong>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            <FaEdit className="me-2 text-primary" /> Edit Profile
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && <Alert variant="danger">{editError}</Alert>}

          <Form onSubmit={handleEditSubmit}>
            {/* Name */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <FaUser className="me-2 text-primary" /> Full Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
                placeholder="Enter your full name"
                required
              />
            </Form.Group>

            <hr />
            <h6 className="fw-bold text-muted mb-3">
              <FaLock className="me-2" /> Change Password (Optional)
            </h6>

            {/* Current Password */}
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={editData.currentPassword}
                  onChange={handleEditChange}
                  placeholder="Enter current password"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* New Password */}
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={editData.newPassword}
                  onChange={handleEditChange}
                  placeholder="Enter new password (min 6 chars)"
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Confirm New Password */}
            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={editData.confirmPassword}
                onChange={handleEditChange}
                placeholder="Confirm new password"
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                <FaTimes className="me-1" /> Cancel
              </Button>
              <Button type="submit" variant="primary" className="btn-glow" disabled={saving}>
                <FaSave className="me-1" /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
