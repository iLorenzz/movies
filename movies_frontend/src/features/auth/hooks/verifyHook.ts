import { useState } from 'react';
import api, { HttpError } from '@/services/api';
import { getCookie } from '@/utils/cookies.client';

interface VerifyPayload {
  token: string
}

export function useVerify() {
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function verify() {
    setIsLoading(true);
    setError(undefined);

    const token = getCookie("access_token");
    if(!token){
        return null
    }

    const result = await api<null, VerifyPayload>('auth/login/verify/', {
      method: 'POST',
      payload: { token },
    });

    if (!result.ok) {
      setError(result.error);
    }

    setIsLoading(false);
    return result;
  }

  return { verify, isLoading, error };
}