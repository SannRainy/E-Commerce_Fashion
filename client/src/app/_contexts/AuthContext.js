// E-Commerce_Fashion-main/client/src/app/_contexts/AuthContext.js
"use client";
import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import API from '../../api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromCookies = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/profile');
          setUser(data);
        } catch (error) {
          Cookies.remove('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUserFromCookies();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      Cookies.set('token', data.token, { expires: 1 }); // Simpan token selama 1 hari
      const { data: profileData } = await API.get('/auth/profile');
      setUser(profileData);
      toast.success('Login berhasil!');
    } catch (error) {
      toast.error('Email atau password salah.');
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      await API.post('/auth/register', { name, email, password });
      toast.success('Registrasi berhasil! Silakan login.');
    } catch (error) {
      toast.error('Gagal mendaftar. Email mungkin sudah digunakan.');
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    toast.info('Anda telah logout.');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);