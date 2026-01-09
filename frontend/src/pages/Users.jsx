import { useState, useEffect } from 'react'

const API_URL = 'http://localhost:3001'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User' })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/api/users`)
      const data = await response.json()
      if (data.success) {
        setUsers(data.data)
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Failed to connect to API. Make sure the backend is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setSuccessMessage('User deleted successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
        fetchUsers()
      } else {
        setError('Failed to delete user')
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      setError('Error deleting user')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user.id)
    setFormData({ name: user.name, email: user.email, role: user.role })
  }

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setEditingUser(null)
        setFormData({ name: '', email: '', role: 'User' })
        setSuccessMessage('User updated successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
        fetchUsers()
      } else {
        setError('Failed to update user')
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      setError('Error updating user')
      setTimeout(() => setError(null), 3000)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setShowAddForm(false)
        setFormData({ name: '', email: '', role: 'User' })
        setSuccessMessage('User added successfully')
        setTimeout(() => setSuccessMessage(null), 3000)
        fetchUsers()
      } else {
        setError('Failed to add user')
        setTimeout(() => setError(null), 3000)
      }
    } catch (err) {
      setError('Error adding user')
      setTimeout(() => setError(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">{error}</div>
        <button className="button" onClick={fetchUsers}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      <div className="card">
        <h1>Users Management</h1>
        <p style={{ marginBottom: '1rem' }}>
          This page demonstrates a data table with CRUD operations (Create, Read, Update, Delete).
        </p>
        
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        
        {error && !loading && (
          <div className="alert alert-error">{error}</div>
        )}
        
        <button 
          className="button button-success" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add New User'}
        </button>

        {showAddForm && (
          <form onSubmit={handleAdd} style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="button button-success">Add User</button>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`badge badge-${user.role.toLowerCase().replace(/\s+/g, '-')}`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td>
                  <div className="button-group">
                    {editingUser === user.id ? (
                      <>
                        <button 
                          className="button button-success" 
                          onClick={() => handleUpdate(user.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="button" 
                          onClick={() => {
                            setEditingUser(null)
                            setFormData({ name: '', email: '', role: 'User' })
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="button" 
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </button>
                        <button 
                          className="button button-danger" 
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
