'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import AuthBg from '../_module/components/AuthBg';
import { useAdminLogin } from '../_module/services';

export default function AdminSignInPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutate: login, isPending } = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <AuthBg>
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-white rounded-2xl px-10 py-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-[24px] font-bold text-[#1e1e1e] mb-2">
              Admin Sign In
            </h1>
            <p className="text-[14px] text-[#5F6368]">
              Access the DevFest Ibadan management console
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium text-[#1e1e1e] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="organiser@devfestibadan.com"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#1e1e1e] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-11 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end mt-2">
                <Link
                  href="/forgot-password"
                  className="text-[13px] text-[#4285F4] font-semibold hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || !email.trim() || !password}
              className="w-full py-3 rounded-lg bg-[#1e1e1e] text-white text-[14px] font-semibold hover:bg-black transition-colors mt-1 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </AuthBg>
  );
}
