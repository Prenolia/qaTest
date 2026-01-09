import { useState } from 'react'

const API_URL = 'http://localhost:3001'

function LoadingStates() {
  const [slowLoading, setSlowLoading] = useState(false)
  const [slowData, setSlowData] = useState(null)
  const [slowError, setSlowError] = useState(null)

  const [unreliableLoading, setUnreliableLoading] = useState(false)
  const [unreliableData, setUnreliableData] = useState(null)
  const [unreliableError, setUnreliableError] = useState(null)

  const [errorData, setErrorData] = useState(null)
  const [errorLoading, setErrorLoading] = useState(false)

  const [customDelay, setCustomDelay] = useState('2000')
  const [customDelayLoading, setCustomDelayLoading] = useState(false)
  const [customDelayData, setCustomDelayData] = useState(null)

  const handleSlowRequest = async () => {
    setSlowLoading(true)
    setSlowData(null)
    setSlowError(null)
    
    try {
      const response = await fetch(`${API_URL}/api/slow`)
      const data = await response.json()
      setSlowData(data)
    } catch (err) {
      setSlowError('Failed to connect to API')
    } finally {
      setSlowLoading(false)
    }
  }

  const handleUnreliableRequest = async () => {
    setUnreliableLoading(true)
    setUnreliableData(null)
    setUnreliableError(null)
    
    try {
      const response = await fetch(`${API_URL}/api/unreliable`)
      const data = await response.json()
      
      if (data.success) {
        setUnreliableData(data)
      } else {
        setUnreliableError(data.error)
      }
    } catch (err) {
      setUnreliableError('Failed to connect to API')
    } finally {
      setUnreliableLoading(false)
    }
  }

  const handleErrorRequest = async () => {
    setErrorLoading(true)
    setErrorData(null)
    
    try {
      const response = await fetch(`${API_URL}/api/error`)
      const data = await response.json()
      setErrorData(data)
    } catch (err) {
      setErrorData({ error: 'Failed to connect to API' })
    } finally {
      setErrorLoading(false)
    }
  }

  const handleCustomDelayRequest = async () => {
    setCustomDelayLoading(true)
    setCustomDelayData(null)
    
    try {
      const response = await fetch(`${API_URL}/api/delay?ms=${customDelay}`)
      const data = await response.json()
      setCustomDelayData(data)
    } catch (err) {
      setCustomDelayData({ error: 'Failed to connect to API' })
    } finally {
      setCustomDelayLoading(false)
    }
  }

  return (
    <div>
      <div className="card">
        <h1>Loading & Error States</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          This page demonstrates different loading states and error scenarios for QA testing.
        </p>
      </div>

      {/* Slow Endpoint */}
      <div className="card">
        <h2>Slow Response (2-5 seconds)</h2>
        <p style={{ marginBottom: '1rem' }}>
          This endpoint simulates a slow API response with a random delay between 2 and 5 seconds.
        </p>
        
        <button 
          className="button" 
          onClick={handleSlowRequest}
          disabled={slowLoading}
        >
          {slowLoading ? 'Loading...' : 'Test Slow Endpoint'}
        </button>

        {slowLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {slowData && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            <strong>Success!</strong> {slowData.message}
          </div>
        )}

        {slowError && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            {slowError}
          </div>
        )}
      </div>

      {/* Unreliable Endpoint */}
      <div className="card">
        <h2>Unreliable Endpoint (50% Error Rate)</h2>
        <p style={{ marginBottom: '1rem' }}>
          This endpoint randomly succeeds or fails with a 50% chance each. Great for testing error handling.
        </p>
        
        <button 
          className="button" 
          onClick={handleUnreliableRequest}
          disabled={unreliableLoading}
        >
          {unreliableLoading ? 'Loading...' : 'Test Unreliable Endpoint'}
        </button>

        {unreliableLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {unreliableData && (
          <div className="alert alert-success" style={{ marginTop: '1rem' }}>
            <strong>Success!</strong> {unreliableData.message} - You got lucky!
          </div>
        )}

        {unreliableError && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <strong>Error:</strong> {unreliableError}
          </div>
        )}
      </div>

      {/* Always Error Endpoint */}
      <div className="card">
        <h2>Always Error Endpoint</h2>
        <p style={{ marginBottom: '1rem' }}>
          This endpoint always returns an error response. Use it to test consistent error state handling.
        </p>
        
        <button 
          className="button button-danger" 
          onClick={handleErrorRequest}
          disabled={errorLoading}
        >
          {errorLoading ? 'Loading...' : 'Test Error Endpoint'}
        </button>

        {errorLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {errorData && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            <strong>Error:</strong> {errorData.error}
            {errorData.code && <div>Code: {errorData.code}</div>}
            {errorData.timestamp && <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Timestamp: {errorData.timestamp}
            </div>}
          </div>
        )}
      </div>

      {/* Custom Delay Endpoint */}
      <div className="card">
        <h2>Custom Delay Endpoint</h2>
        <p style={{ marginBottom: '1rem' }}>
          Set a custom delay (in milliseconds) to simulate different loading scenarios. Maximum 10 seconds.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="number"
            value={customDelay}
            onChange={(e) => setCustomDelay(e.target.value)}
            placeholder="Delay in milliseconds"
            style={{ 
              padding: '0.75rem', 
              borderRadius: '4px', 
              border: '1px solid #bdc3c7',
              width: '200px'
            }}
            min="0"
            max="10000"
          />
          <button 
            className="button" 
            onClick={handleCustomDelayRequest}
            disabled={customDelayLoading}
          >
            {customDelayLoading ? 'Loading...' : 'Test Custom Delay'}
          </button>
        </div>

        {customDelayLoading && (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        )}

        {customDelayData && !customDelayData.error && (
          <div className="alert alert-success">
            <strong>Success!</strong> {customDelayData.message}
          </div>
        )}

        {customDelayData && customDelayData.error && (
          <div className="alert alert-error">
            {customDelayData.error}
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadingStates
