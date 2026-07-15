import { useRef, useState } from 'react';
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
  const [results, setResults] = useState<MovieResult[]>([]);
  const [error, setError] = useState<HttpError | Error | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
 
  const queryRef = useRef('');
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);
 
  async function search(query: string) {
    setIsLoading(true);
    setError(undefined);
    setHasSearched(true);
    queryRef.current = query;
    pageRef.current = 1;
 
    const result = await api<SearchResponse>(
      `movies/?query=${encodeURIComponent(query)}&page=1`,
      { method: 'GET' }
    );
 
    if (result.ok) {
      setResults(result.data.results);
      totalPagesRef.current = result.data.total_pages;
      setHasMore(result.data.page < result.data.total_pages);
    } else {
      setError(result.error);
      setResults([]);
      setHasMore(false);
    }
 
    setIsLoading(false);
  }
 
  async function loadMore() {
    if (isLoadingMore || !hasMore) return;
 
    setIsLoadingMore(true);
    const nextPage = pageRef.current + 1;
 
    const result = await api<SearchResponse>(
      `movies/?query=${encodeURIComponent(queryRef.current)}&page=${nextPage}`,
      { method: 'GET' }
    );
 
    if (result.ok) {
      pageRef.current = nextPage;
      setResults((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        const fresh = result.data.results.filter((m) => !seen.has(m.id));
        return [...prev, ...fresh];
      });
      setHasMore(result.data.page < result.data.total_pages);
    } else {
      setHasMore(false);
    }
 
    setIsLoadingMore(false);
  }
 
  return { search, loadMore, results, isLoading, isLoadingMore, error, hasSearched, hasMore };
}
