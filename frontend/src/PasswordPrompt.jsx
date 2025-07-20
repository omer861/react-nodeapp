import { useState } from 'react';
import './PasswordPrompt.css';

export default function PasswordPrompt({ open, onSubmit, onClose, loading }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    setError('');
    onSubmit(password, setError, () => setPassword(''));
  };

  return (
    <div className="pw-modal-backdrop">
      <div className="pw-modal">
        <h2>Enter Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="pw-input-group">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoFocus
              disabled={loading}
            />
            <button
              type="button"
              className="pw-show"
              onClick={() => setShow(s => !s)}
              tabIndex={-1}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <div className="pw-error">{error}</div>}
          <div className="pw-actions">
            <button type="submit" disabled={loading} className="pw-submit">{loading ? 'Checking...' : 'Submit'}</button>
            <button type="button" onClick={onClose} className="pw-cancel" disabled={loading}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
} 