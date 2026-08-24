'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/app/_module/lib/utils';
import AuthBg from '../_module/components/AuthBg';

type Strength = 'weak' | 'fair' | 'strong' | 'very-strong';

function getStrength(password: string): Strength {
  if (!password) return 'weak';
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'strong';
  return 'very-strong';
}

const STRENGTH_CONFIG: Record<
  Strength,
  { label: string; color: string; bars: number }
> = {
  weak: { label: 'Weak', color: '#EF4444', bars: 1 },
  fair: { label: 'Fair', color: '#F59E0B', bars: 2 },
  strong: { label: 'Strong', color: '#3B82F6', bars: 3 },
  'very-strong': { label: 'Very Strong', color: '#22C55E', bars: 4 },
};

function StrengthMeter({ password }: { password: string }) {
  const strength = getStrength(password);
  const { label, color, bars } = STRENGTH_CONFIG[strength];

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[4px] flex-1 rounded-[2px] transition-all duration-300"
            style={{ backgroundColor: i <= bars ? color : '#E5E7EB' }}
          />
        ))}
      </div>

      <p className="text-[12px] font-medium" style={{ color }}>
        {label} password
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch || !password || !confirm) return;
    router.push('/password-changed');
  };

  return (
    <AuthBg>
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-white rounded-2xl px-10 py-10 shadow-sm">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="text-[22px] font-bold text-[#1e1e1e] mb-2">
              Reset Password
            </h1>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Choose a strong, unique password to secure your admin account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* New Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#1e1e1e] mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
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
              <StrengthMeter password={password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[13px] font-medium text-[#1e1e1e] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className={cn(
                    'w-full border rounded-lg px-4 py-3 pr-11 text-[13px] text-gray-800 placeholder:text-gray-400 focus:outline-none transition-colors bg-white',
                    mismatch
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-gray-200 focus:border-gray-400'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Red mismatch error */}
              {mismatch && (
                <p className="text-[12px] font-medium text-red-500 mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={mismatch || !password || !confirm}
              className="w-full py-3 rounded-lg bg-[#1e1e1e] text-white text-[14px] font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </AuthBg>
  );
}
