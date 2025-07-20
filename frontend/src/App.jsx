import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import PasswordPrompt from './PasswordPrompt';

const API_URL = 'https://node.coreventum.com/api/employees';
const APP_PASSWORD = import.meta.env.VITE_EMPLOYEE_APP_PASSWORD;

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password prompt state
  const [pwOpen, setPwOpen] = useState(false);
  const [pwAction, setPwAction] = useState(null); // { type, payload }
  const [pwLoading, setPwLoading] = useState(false);
  const pwCallback = useRef(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch employees');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    if (!form.name || !form.email || !form.department) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: '', email: '', department: '' });
      setError('');
      fetchEmployees();
    } catch (err) {
      setError('Failed to save employee');
    }
    setLoading(false);
  };

  // Edit
  const handleEdit = (emp) => {
    setForm({ name: emp.name, email: emp.email, department: emp.department });
    setEditingId(emp.id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchEmployees();
      setError('');
    } catch (err) {
      setError('Failed to delete employee');
    }
    setLoading(false);
  };

  // Wrappers for password prompt
  const onAddOrUpdate = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.department) {
      setError('Please enter values in all fields');
      return;
    }
    setError('');
    requestPassword('addOrUpdate', null, () => handleSubmit());
  };
  const onEdit = (emp) => {
    requestPassword('edit', emp, () => handleEdit(emp));
  };
  const onDelete = (id) => {
    requestPassword('delete', id, () => handleDelete(id));
  };

  return (
    <div className="container">
      <h1>Employee Management</h1>
      <form className="employee-form" onSubmit={onAddOrUpdate}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {editingId ? 'Update' : 'Add'} Employee
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '', email: '', department: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
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
                <td colSpan="5">No employees found.</td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>
                    <button onClick={() => onEdit(emp)}>Edit</button>
                    <button onClick={() => onDelete(emp.id)} className="delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
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
