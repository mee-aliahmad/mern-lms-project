import { Spinner } from 'react-bootstrap';

/**
 * Centered loading spinner component
 */
const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
