import { Container } from 'react-bootstrap';
import { FaGraduationCap, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

/**
 * Footer component
 */
const Footer = () => {
  return (
    <footer className="footer-section mt-auto">
      <Container>
        <div className="row py-4">
          <div className="col-md-4 mb-3 mb-md-0">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaGraduationCap size={24} className="text-primary" />
              <h5 className="mb-0 fw-bold">LearnHub</h5>
            </div>
            <p className="text-muted small mb-0">
              Empowering learners worldwide with quality education.
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/courses" className="text-muted text-decoration-none">Browse Courses</a></li>
              <li><a href="/about" className="text-muted text-decoration-none">About Us</a></li>
              <li><a href="/register" className="text-muted text-decoration-none">Get Started</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="fw-bold mb-2">Connect</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted"><FaGithub size={20} /></a>
              <a href="#" className="text-muted"><FaLinkedin size={20} /></a>
              <a href="#" className="text-muted"><FaTwitter size={20} /></a>
            </div>
          </div>
        </div>
        <hr className="my-2" />
        <p className="text-center text-muted small py-2 mb-0">
          &copy; {new Date().getFullYear()} LearnHub LMS. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
