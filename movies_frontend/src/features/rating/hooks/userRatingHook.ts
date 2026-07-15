import { useCallback, useState } from 'react';
import api, { HttpError } from '@/services/api';
 
// Item retornado por GET ratings/ (RatingSearchByUserView)
export interface UserRating {
  rating_id: number;
  score: number;
  movie_id: number;
  title: string | null;
  poster_path: string | null; // já vem como URL completa (build_poster_url)
}
 
export function useUserRatings() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<HttpError | Error | undefined>();
 
  const fetchRatings = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
 
    try {
      const result = await api<UserRating[]>('ratings/', { method: 'GET' });
 
      if (result.ok) {
        setRatings(result.data);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);
 
  return { fetchRatings, ratings, isLoading, error };
}
