import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import PasswordPrompt from './PasswordPrompt';

const API_URL = import.meta.env.VITE_API_URL || 'http://54.198.228.118:3000/api/employees';
const APP_PASSWORD = import.meta.env.VITE_EMPLOYEE_APP_PASSWORD;

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Password prompt state
  const [pwOpen, setPwOpen] = useState(false);
  const [pwAction, setPwAction] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);
  const pwCallback = useRef(null);

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (!form.department.trim()) errors.department = 'Department is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to fetch employees';
      setError(message);
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Password-protected handlers
  const requestPassword = (type, payload, callback) => {
    setPwAction({ type, payload });
    setPwOpen(true);
    pwCallback.current = callback;
  };

  const handlePasswordSubmit = (password, setError, resetPwInput) => {
    setPwLoading(true);
    setTimeout(() => {
      if (password !== APP_PASSWORD) {
        setError('Incorrect password');
        setPwLoading(false);
        return;
      }
      setPwOpen(false);
      setPwLoading(false);
      resetPwInput();
      if (pwCallback.current) pwCallback.current();
    }, 400);
  };

  // Add or update
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setSuccess('Employee updated successfully!');
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
        setSuccess('Employee added successfully!');
      }
      setForm({ name: '', email: '', department: '' });
      fetchEmployees();
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to save employee';
      setError(message);
      console.error('Submit error:', err);
    }
    setLoading(false);
  };

  // Edit
  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, department: emp.department });
    setEditingId(emp.id);
    setSuccess('');
    setError('');
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSuccess('Employee deleted successfully!');
      fetchEmployees();
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Failed to delete employee';
      setError(message);
      console.error('Delete error:', err);
    }
    setLoading(false);
  };

  // Wrappers for password prompt
  const onAddOrUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setError('');
    setSuccess('');
    requestPassword('addOrUpdate', null, () => handleSubmit());
  };

  const onEdit = (emp) => {
    requestPassword('edit', emp, () => handleEdit(emp));
  };

  const onDelete = (id) => {
    requestPassword('delete', id, () => handleDelete(id));
  };

  const clearForm = () => {
    setEditingId(null);
    setForm({ name: '', email: '', department: '' });
    setFormErrors({});
    setError('');
    setSuccess('');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Employee Management System</h1>
        <p>Manage your team with ease and efficiency</p>
      </div>
      
      <div className="employee-form">
        <h2>Add/Edit Employee</h2>
        <form onSubmit={onAddOrUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter employee name"
                value={form.name}
                onChange={handleChange}
                className={formErrors.name ? 'error' : ''}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={form.email}
                onChange={handleChange}
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-text">{formErrors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                placeholder="Enter department"
                value={form.department}
                onChange={handleChange}
                className={formErrors.department ? 'error' : ''}
              />
              {formErrors.department && <span className="error-text">{formErrors.department}</span>}
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (editingId ? 'Update Employee' : 'Add Employee')}
            </button>
            {editingId && (
              <button type="button" onClick={clearForm} className="btn btn-secondary">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      <div className="table-container">
        <div className="table-header">
          <h2>Employee List</h2>
        </div>
        {loading && employees.length === 0 ? (
          <div className="loading">Loading employees...</div>
        ) : (
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">No employees found</td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>#{emp.id}</td>
                      <td><strong>{emp.name}</strong></td>
                      <td>{emp.email}</td>
                      <td>
                        <span className="status-badge status-active">{emp.department}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => onEdit(emp)} className="btn-edit">
                            ✏️ Edit
                          </button>
                          <button onClick={() => onDelete(emp.id)} className="btn-delete">
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <PasswordPrompt
        open={pwOpen}
        onSubmit={handlePasswordSubmit}
        onClose={() => setPwOpen(false)}
        loading={pwLoading}
      />
    </div>
  );
}

export default App;
