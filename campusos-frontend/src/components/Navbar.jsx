import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#1e293b',
        color: '#fff',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}>
          CampusOS
        </Link>
        {user && (
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
            {user.role === 'ROLE_ADMIN' && (
              <>
                <Link to="/admin" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Overview
                </Link>
                <Link to="/admin/users" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  User Onboarding
                </Link>
              </>
            )}
            {user.role === 'ROLE_FACULTY' && (
              <Link to="/faculty" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Console
              </Link>
            )}
            {user.role === 'ROLE_STUDENT' && (
              <Link to="/student" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Portal
              </Link>
            )}
            {user.role === 'ROLE_PLACEMENT_OFFICER' && (
              <Link to="/placement" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                Placements
              </Link>
            )}
            <Link to="/announcements" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Bulletins
            </Link>
            <Link to="/timetable" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              Timetable
            </Link>
          </div>
        )}
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>
              {user.fullName} ({user.role.replace('ROLE_', '')})
            </span>
            <button
              onClick={logout}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;