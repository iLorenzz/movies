import { useState } from 'react';
import api, { HttpError } from '@/services/api';

interface RegisterResponse {
  id: number;
  email: string;
}

interface RegisterPayload {
  email: string;
  password: string;
}

export function useRegister() {
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function register(email: string, password: string) {
    setIsLoading(true);
    setError(undefined);

    const result = await api<RegisterResponse, RegisterPayload>('auth/signup/', {
      method: 'POST',
      payload: { email, password },
    });

    if (!result.ok) {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }

  return { register, isLoading, error };
}