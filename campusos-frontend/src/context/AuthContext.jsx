import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('campusos_user');
    const token = localStorage.getItem('campusos_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token, id, fullName, role } = response.data;

    const userData = { id, email: response.data.email, fullName, role };
    localStorage.setItem('campusos_token', token);
    localStorage.setItem('campusos_user', JSON.stringify(userData));

    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('campusos_token');
    localStorage.removeItem('campusos_user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);