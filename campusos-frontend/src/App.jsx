import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import PlacementDashboard from './pages/PlacementDashboard.jsx';
import Announcements from './pages/Announcements.jsx';
import Timetable from './pages/Timetable.jsx';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={user?.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/users"
            element={user?.role === 'ROLE_ADMIN' ? <UserManagement /> : <Navigate to="/login" />}
          />
          <Route
            path="/student"
            element={user?.role === 'ROLE_STUDENT' ? <StudentPortal /> : <Navigate to="/login" />}
          />
          <Route
            path="/faculty"
            element={user?.role === 'ROLE_FACULTY' ? <FacultyDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/placement"
            element={user?.role === 'ROLE_PLACEMENT_OFFICER' ? <PlacementDashboard /> : <Navigate to="/login" />}
          />
          {/* Shared Authenticated Routes */}
          <Route
            path="/announcements"
            element={user ? <Announcements /> : <Navigate to="/login" />}
          />
          <Route
            path="/timetable"
            element={user ? <Timetable /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? `/${user.role.replace('ROLE_', '').toLowerCase()}` : '/login'} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;