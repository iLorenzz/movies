'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { display } from '@/lib/fonts';
import { useLogin } from '@/features/auth/hooks/loginHook';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await login(email, password);
    if (result.ok) router.push('/');
  }

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A32638]">
        Welcome back
      </p>
      <h1 className={`${display.className} text-4xl tracking-wide text-[#221F1A] mt-1`}>
        Log in
      </h1>
      <p className="text-sm text-[#8A8477] mt-2">
        Pick up where you left off.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#221F1A]">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#DCD5C4] bg-white px-3.5 py-2.5 text-[#221F1A] placeholder:text-[#B8B0A0] outline-none transition focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:border-transparent"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#221F1A]">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-[#DCD5C4] bg-white px-3.5 py-2.5 text-[#221F1A] placeholder:text-[#B8B0A0] outline-none transition focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-[#A32638]">
            {error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-[#A32638] py-2.5 text-sm font-semibold text-[#F6F1E7] transition hover:bg-[#7E1D2B] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1E7]"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A8477]">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-[#A32638] hover:underline">
          Create one
        </Link>
      </p>
    </>
  );
}