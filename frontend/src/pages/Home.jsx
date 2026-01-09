function Home() {
  return (
    <div>
      <div className="card">
        <h1>Welcome to QA Testbed</h1>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          This is a testing environment designed for QA scenarios. Explore the different pages to test various UI patterns and API interactions.
        </p>
        
        <h2>Features</h2>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.8' }}>
          <li><strong>Users Table:</strong> View, create, update, and delete user records with a data table interface</li>
          <li><strong>Forms:</strong> Test form validation with client-side validation rules</li>
          <li><strong>Loading/Errors:</strong> Test various loading states and error scenarios</li>
        </ul>

        <h2>Backend API</h2>
        <p style={{ marginBottom: '0.5rem', lineHeight: '1.6' }}>
          The backend runs on <code>http://localhost:3001</code> and provides:
        </p>
        <ul style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>Standard CRUD endpoints for user management</li>
          <li>Endpoints with simulated latency for testing loading states</li>
          <li>Endpoints that intentionally return errors for testing error handling</li>
          <li>Form validation endpoint</li>
        </ul>
      </div>

      <div className="card">
        <h2>Getting Started</h2>
        <ol style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li>Make sure the backend server is running on port 3001</li>
          <li>Navigate through the different pages using the menu above</li>
          <li>Test various scenarios including success, loading, and error states</li>
        </ol>
      </div>
    </div>
  )
}

export default Home
