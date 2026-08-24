'use client';

import Link from 'next/link';
import AuthBg from '../_module/components/AuthBg';
import PasswordChanged from '../_module/components/icons/PasswordChanged';

export default function PasswordChangedPage() {
  return (
    <AuthBg>
      <div className="w-full max-w-[460px] mx-auto">
        <div className="bg-white rounded-2xl px-10 py-10 shadow-sm flex flex-col items-center gap-6 text-center">
          {/* Green check circle */}
          <PasswordChanged />
          {/* Text */}
          <div>
            <h1 className="text-[22px] font-bold text-[#1e1e1e] mb-2">
              Password Changed!
            </h1>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
          </div>

          {/* CTA */}
          <Link href="/admin" className="w-full">
            <button
              type="button"
              className="w-full py-3 rounded-[8px] bg-[#1e1e1e] text-white text-[14px] font-semibold hover:bg-black transition-colors"
            >
              Back to Sign In
            </button>
          </Link>
        </div>
      </div>
    </AuthBg>
  );
}
