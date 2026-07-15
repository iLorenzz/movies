import { useState } from 'react';
import api, { HttpError } from '@/services/api';
import { setCookie } from '@/utils/cookies.client';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export function useLogin() {
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(undefined);

    const result = await api<LoginResponse, LoginPayload>('auth/login/', {
      method: 'POST',
      payload: { email, password },
    });

    if (result.ok) {
      setCookie('access_token', result.data.access, 60 * 5);
      setCookie('refresh_token', result.data.refresh, 60 * 60 * 24);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }

  return { login, isLoading, error };
}