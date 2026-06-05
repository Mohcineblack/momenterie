import { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';
import { GoogleSignInButton } from '@/components/auth/google-signin-button';
import { AppleSignInButton } from '@/components/auth/apple-signin-button';

export const metadata: Metadata = {
  title: 'Login - Momenterie',
  description: 'Sign in to your Momenterie account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-gray-900">Momenterie</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6">
            {/* Google Sign In */}
            <div>
              <GoogleSignInButton />
              <div className="mt-3">
                <AppleSignInButton />
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <LoginForm />
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Links */}
        <div className="text-center space-y-2">
          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 hover:text-gray-900 block"
          >
            Forgot your password?
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
