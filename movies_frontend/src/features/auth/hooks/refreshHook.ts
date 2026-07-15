import { useState } from 'react';
import api, { HttpError } from '@/services/api';
import { getCookie, setCookie } from '@/utils/cookies.client';

interface RefreshPayload {
  refresh: string
}

interface RefreshResponse {
    access: string
}

export function useRefresh() {
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function refresh() {
    setIsLoading(true);
    setError(undefined);

    const refresh = getCookie("refresh_token");
    if(!refresh){
        return null
    }

    const result = await api<RefreshResponse, RefreshPayload>('auth/login/refresh/', {
        method: 'POST',
        payload: { refresh },
    });

    if (!result.ok) {
        setError(result.error);
    }else{
        setCookie("access_token", result.data.access, 60 * 5)
    }

    setIsLoading(false);
    return result;
  }

  return { refresh, isLoading, error };
}