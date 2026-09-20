import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else if (loggedInUser.role === 'ROLE_FACULTY') {
        navigate('/faculty');
      } else if (loggedInUser.role === 'ROLE_STUDENT') {
        navigate('/student');
      } else {
        navigate('/placement');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Verify credentials.');
    }
  };

  return (
    <div style={{
      maxWidth: '420px',
      margin: '60px auto',
      padding: '32px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>CampusOS Login</h2>

      {errorMsg && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. admin@campusos.com"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;