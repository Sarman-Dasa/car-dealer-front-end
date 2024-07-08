import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" style={styles.container}>
      <h1 style={styles.title}>Something went wrong.</h1>
      <p style={styles.message}>We apologize for the inconvenience. Please try again later.</p>
      <details style={styles.details}>
        <summary>Click for more information</summary>
        <p>{error.message}</p>
      </details>
      <button style={styles.button} onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    margin: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  details: {
    textAlign: 'left',
    marginBottom: '20px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ErrorBoundary;
