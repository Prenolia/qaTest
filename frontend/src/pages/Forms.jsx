import { useState } from 'react'

const API_URL = 'http://localhost:3001'

function Forms() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Client-side validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 150)) {
      newErrors.age = 'Age must be a number between 0 and 150'
    }

    if (formData.message.length > 500) {
      newErrors.message = 'Message must be less than 500 characters'
    }

    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setSubmitStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Client-side validation
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSubmitStatus({ type: 'error', message: 'Please fix the errors above' })
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setSubmitStatus(null)

    try {
      // Server-side validation
      const response = await fetch(`${API_URL}/api/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()

      if (data.success) {
        setSubmitStatus({ type: 'success', message: 'Form submitted successfully! All validations passed.' })
        // Reset form on success
        setTimeout(() => {
          setFormData({ name: '', email: '', age: '', message: '' })
          setSubmitStatus(null)
        }, 3000)
      } else {
        setErrors(data.errors || {})
        setSubmitStatus({ type: 'error', message: 'Server validation failed' })
      }
    } catch (err) {
      setSubmitStatus({ type: 'error', message: 'Failed to connect to server. Make sure the backend is running.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({ name: '', email: '', age: '', message: '' })
    setErrors({})
    setSubmitStatus(null)
  }

  return (
    <div>
      <div className="card">
        <h1>Form Validation</h1>
        <p style={{ marginBottom: '1.5rem' }}>
          This page demonstrates client-side and server-side form validation. Try submitting invalid data to see validation in action.
        </p>

        {submitStatus && (
          <div className={`alert alert-${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name (min 2 characters)"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="age">Age (Optional)</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age (0-150)"
            />
            {errors.age && <div className="error-message">{errors.age}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (Optional)</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              placeholder="Enter a message (max 500 characters)"
            />
            <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
              {formData.message.length} / 500 characters
            </div>
            {errors.message && <div className="error-message">{errors.message}</div>}
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="button button-success" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </button>
            <button 
              type="button" 
              className="button" 
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Validation Rules</h2>
        <ul style={{ marginLeft: '2rem', lineHeight: '1.8' }}>
          <li><strong>Name:</strong> Required, minimum 2 characters</li>
          <li><strong>Email:</strong> Required, must be a valid email format</li>
          <li><strong>Age:</strong> Optional, must be a number between 0 and 150</li>
          <li><strong>Message:</strong> Optional, maximum 500 characters</li>
        </ul>
        <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
          * Both client-side and server-side validation are performed
        </p>
      </div>
    </div>
  )
}

export default Forms
