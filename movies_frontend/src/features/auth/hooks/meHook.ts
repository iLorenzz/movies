import { useState } from 'react';
import api, { HttpError } from '@/services/api';
import { getCookie } from '@/utils/cookies.client';

interface MePayload {
  email: string
}

export function useMe() {
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function me() {
    setIsLoading(true);
    setError(undefined);

    const result = await api<MePayload, null>('auth/me/', {
      method: 'GET',
    });

    if (!result.ok) {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }

  return { me, isLoading, error };
}