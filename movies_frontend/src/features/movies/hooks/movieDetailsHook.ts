import { useCallback, useState } from 'react';
import api, { HttpError } from '@/services/api';
 
interface CastMember {
  id: number;
  name: string;
}
 
export interface MovieDetails {
  original_title: string;
  overview: string;
  poster_path: string | null; 
  release_date: string | null;
  credits: { cast: CastMember[] };
}
 
export function useMovieDetails() {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<HttpError | Error | undefined>();
 
  const fetchDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(undefined);
 
    try {
      const result = await api<MovieDetails>(
        `movie/details/${id}/`,
        { method: 'GET' }
      );
 
      if (result.ok) {
        setDetails(result.data);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  return { fetchDetails, details, isLoading, error };
}
