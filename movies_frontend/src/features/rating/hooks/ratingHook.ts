import { useCallback, useState } from 'react';
import api from '@/services/api';
 
// Item retornado por GET ratings/ (RatingSearchByUserView)
interface UserRatingItem {
  rating_id: number;
  score: number;
  movie_id: number;
  title: string | null;
  poster_path: string | null;
}
 
// Retorno do RatingSerializer (POST rating/ e PUT rating/<id>/)
interface Rating {
  id: number;
  score: number;
  user_id: number;
  movie_id: number;
  created_at: string;
  updated_at: string;
}
 
interface RatingPayload {
  score: number;
  movie_id: number;
}
 
export function useRating() {
  const [ratingId, setRatingId] = useState<number | null>(null); 
  const [score, setScore] = useState(0);                          
  const [isSaving, setIsSaving] = useState(false);
 
  const loadRating = useCallback(async (movieId: string) => {
    try {
      const result = await api<UserRatingItem[]>('ratings/', { method: 'GET' });
 
      if (result.ok) {
        const mine = result.data.find((r) => String(r.movie_id) === movieId);
        if (mine) {
          setRatingId(mine.rating_id);
          setScore(mine.score);
        }
      }
    } catch {
    }
  }, []);
 
  async function rate(movieId: string, value: number) {
    if (isSaving) return;
    setIsSaving(true);
 
    try {
      if (ratingId !== null) {
        const result = await api<Rating, RatingPayload>(
          `rating/${ratingId}/`,
          { method: 'PUT', payload: { score: value, movie_id: Number(movieId) } }
        );
        if (result.ok) setScore(result.data.score);
      } else {
        const result = await api<Rating, RatingPayload>(
          'rating/',
          { method: 'POST', payload: { score: value, movie_id: Number(movieId) } }
        );
        if (result.ok) {
          setRatingId(result.data.id);
          setScore(result.data.score);
        }
      }
    } finally {
      setIsSaving(false);
    }
  }
 
  async function removeRating() {
    if (ratingId === null || isSaving) return;
    setIsSaving(true);
 
    try {
      const result = await api(`rating/${ratingId}/`, { method: 'DELETE' });
      if (result.ok) {
        setRatingId(null);
        setScore(0);
      }
    } finally {
      setIsSaving(false);
    }
  }
 
  return { loadRating, rate, removeRating, ratingId, score, isSaving };
}
