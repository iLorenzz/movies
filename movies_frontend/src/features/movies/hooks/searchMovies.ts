import { useState } from 'react';
import api, { HttpError } from '@/services/api';

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface SearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieResult[];
}

export function useSearchMovies() {
  const [results, setResults] = useState<MovieResult[]>([]);   // <- o generic precisa estar aqui
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function search(query: string) {
    setIsLoading(true);
    setError(undefined);
    setHasSearched(true);

    const result = await api<SearchResponse>(
      `movies/?query=${encodeURIComponent(query)}`,
      { method: 'GET' }
    );

    if (result.ok) {
      setResults(result.data.results);
    } else {
      setError(result.error);
    }

    setIsLoading(false);
  }

  return { search, results, isLoading, error, hasSearched };
}