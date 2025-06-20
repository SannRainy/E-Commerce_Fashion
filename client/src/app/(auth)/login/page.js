"use client";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/_hooks/useAuth';
import API from '@/services/api';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    try {
      const response = await API.post('/auth/login', data);
      login(response.data.token); // Simpan token dan redirect
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid credentials.');
    }
  };

}