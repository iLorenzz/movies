'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bebas_Neue, Inter } from 'next/font/google';
import { useRegister } from '@/features/auth/hooks/registerHook';
import { useLogin } from '@/features/auth/hooks/loginHook';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

export function RegisterForm() {
  const router = useRouter();
  const { register, isLoading: isRegistering, error: registerError } = useRegister();
  const { login, isLoading: isLoggingIn, error: loginError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isLoading = isRegistering || isLoggingIn;
  const error = registerError || loginError;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const registerResult = await register(email, password);
    if (!registerResult.ok) return;

    const loginResult = await login(email, password);
    if (loginResult.ok) router.push('/movies');
  }

  return (
    <div className={`${body.className} min-h-screen flex items-center justify-center bg-[#14141A] bg-[radial-gradient(ellipse_at_top,_#1F1E29_0%,_#14141A_60%)] px-4`}>
      <div className="relative w-full max-w-sm motion-safe:animate-[fadeIn_0.4s_ease-out]">
        {/* Perfuração estilo rolo de filme, no topo do card */}
        <div className="absolute -top-2 left-0 right-0 flex justify-center gap-3 px-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="h-3 w-3 rounded-full bg-[#14141A]" />
          ))}
        </div>

        <div className="rounded-2xl bg-[#F6F1E7] px-8 pt-9 pb-8 shadow-[0_20px_60px_-15px_rgba(163,38,56,0.35)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A32638]">
            Sessão gratuita
          </p>
          <h1 className={`${display.className} text-4xl tracking-wide text-[#221F1A] mt-1`}>
            Crie sua conta
          </h1>
          <p className="text-sm text-[#8A8477] mt-2">
            Avalie filmes e monte sua lista de assistidos.
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
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#221F1A]">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#8A8477]">
            Já tem conta?{' '}
            <a href="/login" className="font-medium text-[#A32638] hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}