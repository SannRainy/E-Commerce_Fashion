// E-Commerce_Fashion-main/client/src/app/(auth)/login/page.js
"use client";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // Gunakan useRouter dari next/navigation
import { useAuth } from '../../_contexts/AuthContext';
import Button from '../../components/Button';
import Link from 'next/link';   

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      router.push('/'); // Arahkan ke homepage setelah login berhasil
    } catch (error) {
      // Toast error sudah ditangani di dalam fungsi login
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-secondary">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6 rounded-lg bg-white p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
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
                name="password"
                type="password"
                autoComplete="current-password"
                required
                {...register("password", { required: "Password is required" })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Password"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="text-sm text-right">
            <a href="#" className="font-medium text-primary hover:text-primary-dark">
              Forgot your password?
            </a>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
            Start a Registration
          </Link>
        </p>
      </div>
    </div>
  );
}