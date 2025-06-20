// client/src/app/(auth)/register/page.js

"use client";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../../../api';
import Button from '../../components/Button';
import Link from 'next/link';


export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    const onSubmit = async (data) => {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }
      toast.info(`Mencoba mendaftar dengan email: ${data.email}`);
      // Simulasi
       setTimeout(() => toast.success("Registrasi berhasil! Silakan login. (Simulasi)"), 1000);
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold tracking-tight text-secondary">
              Create your account
            </h2>
          </div>
          <form className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full Name"
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Email address"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Password"
                />
                {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
              </div>
               <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
              </div>
            </div>
            
            <div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
           <p className="mt-4 text-center text-sm text-gray-600">
            Already a member?{' '}
            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
}