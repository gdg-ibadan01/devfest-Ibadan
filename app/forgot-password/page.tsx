'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuthBg from '../_module/components/AuthBg';
import { useForgotPassword } from '../_module/services';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const { mutate: sendReset, isPending, isSuccess } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendReset({ email });
  };

  return (
    <AuthBg>
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-white rounded-2xl px-10 py-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-bold text-[#1e1e1e] mb-2">Forgot Password?</h1>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Enter your email address and we&apos;ll send you a reset link to
              regain access.
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
                placeholder="e.g. admin@devfestibadan.com"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 transition-colors bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || isSuccess || !email.trim()}
              className="w-full py-3 rounded-lg bg-[#1e1e1e] text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending…' : isSuccess ? 'Link Sent!' : 'Send Reset Link'}
            </button>

            {/* Back to sign in */}
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 text-[13px] text-[#1e1e1e] hover:underline font-medium"
            >
              <ArrowLeft size={15} />
              Back to Sign In
            </Link>
          </form>
        </div>
      </div>
    </AuthBg>
  );
}
