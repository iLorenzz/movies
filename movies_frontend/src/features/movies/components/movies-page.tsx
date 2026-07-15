'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Bebas_Neue, Inter } from 'next/font/google';
import { useSearchMovies } from '@/features/movies/hooks/searchMovies';
import { useVerify } from '@/features/auth/hooks/verifyHook';
import { useRefresh } from '@/features/auth/hooks/refreshHook';
import { useMe } from '@/features/auth/hooks/meHook';
import { deleteCookie } from '@/utils/cookies.client';
import { MovieModal } from './movie-modal';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

export function MovieSearch() {
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { search, loadMore, results, isLoading, isLoadingMore, error, hasSearched, hasMore } = useSearchMovies();
  const { verify } = useVerify();
  const { refresh } = useRefresh();
  const { me } = useMe();

  useEffect(
    () => {
      (async () => {
          const verificationResult = await verify()

          if(verificationResult && verificationResult.ok){
            getMe();
            setIsLoggedIn(true);
            return;
          }

          const refreshResult = await refresh()

          if(!refreshResult){
            setIsLoggedIn(false);
            return;
          }

          if(refreshResult.ok){
            getMe();
            setIsLoggedIn(true);
          }
      }) ()
    }, [])

    useEffect(() => {
      if (!menuOpen) {
        return;
      }

      function handleClickOutside(e: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setMenuOpen(false);
        }
      }

      document.addEventListener('mousedown', handleClickOutside);

      return () => document.removeEventListener('mousedown', handleClickOutside);

    }, [menuOpen]);

    useEffect(() => {
      if (!hasSearched || isLoading || isLoadingMore || !hasMore) {
        return;
      }

      const sentinel = sentinelRef.current;
      if (!sentinel) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(sentinel);

      return () => observer.disconnect();
    }, [hasSearched, isLoading, isLoadingMore, hasMore, loadMore]);

    async function getMe(){
      const result = await me();

      if(result.ok && result.data){
        console.log(result.data.email);
        setEmail(result.data.email)
      }
      else{
        setEmail("Logged")
      }
    }

    function handleLogout() {
      deleteCookie("access_token");
      deleteCookie("refresh_token");

      setIsLoggedIn(false);
      setEmail("");
      setMenuOpen(false);
    }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) search(query);
  }


  return (
    <div className={`${body.className} min-h-screen bg-[#14141A] bg-[radial-gradient(ellipse_at_top,_#1F1E29_0%,_#14141A_55%)]`}>
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className={`${display.className} text-2xl tracking-[0.15em] text-[#F6F1E7]`}>
          OCTAGRAM
        </span>
        {isLoggedIn ? (
          <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className={`${display.className} flex items-center gap-2 text-xl tracking-[0.15em] text-[#F6F1E7] transition hover:text-[#A32638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A] rounded-full px-2 cursor-pointer`}
          >
            {email}
            <svg
              width="12" height="12" viewBox="0 0 12 12"
              className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-lg border border-[#2A2833] bg-[#1F1E29] py-1 shadow-lg shadow-black/40 z-10"
            >
              <Link
                href="/ratings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-2 text-left text-sm text-[#F6F1E7] transition hover:bg-[#A32638] focus-visible:outline-none focus-visible:bg-[#A32638] cursor-pointer"
              >
                My ratings
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm text-[#F6F1E7] transition hover:bg-[#A32638] focus-visible:outline-none focus-visible:bg-[#A32638] cursor-pointer"
              >
                Log out
              </button>
            </div>
          )}
        </div>) 
          : 
          (
            <Link
            href="/login"
            className="rounded-full border border-[#A32638] px-5 py-2 text-sm font-medium text-[#F6F1E7] transition hover:bg-[#A32638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A]"
        >
          Log in
        </Link>
        ) }
      </header>

      <section className="px-6 pt-10 pb-8 max-w-2xl mx-auto text-center">
        <h1 className={`${display.className} text-5xl sm:text-6xl tracking-wide text-[#F6F1E7]`}>
          Find the right movie for tonight
        </h1>
        <p className="text-[#8A8477] mt-3">
          Search, rate and build your watched list.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a movie title..."
            className="flex-1 rounded-full bg-[#F6F1E7] px-5 py-3 text-[#221F1A] placeholder:text-[#B8B0A0] outline-none focus-visible:ring-2 focus-visible:ring-[#A32638]"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="rounded-full bg-[#A32638] px-6 py-3 text-sm font-semibold text-[#F6F1E7] transition hover:bg-[#7E1D2B] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A] cursor-pointer"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-3 text-sm text-[#A32638] text-left ml-[20px]">
            Couldn&apos;t search right now. Try again in a moment.
          </p>
        )}
      </section>

      <section className="px-6 pb-16 max-w-5xl mx-auto">
        {!error && hasSearched && !isLoading && results.length === 0 && (
          <p className="text-center text-[#8A8477]">
            No movies found for &quot;{query}&quot;.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {results.map((movie) => (
            <button
              key={movie.id}
              type="button"
              onClick={() => setSelectedMovieId(String(movie.id))}
              className="group text-left cursor-pointer"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#1F1E29]">
                {movie.poster_path ? (
                  <img
                    src={movie.poster_path}
                    alt={movie.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-[#8A8477] text-xs text-center px-3">
                    No poster available
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-[#F6F1E7] line-clamp-2">
                {movie.title}
              </p>
            </button>
          ))}
        </div>

        {isLoadingMore && (
          <div className="flex justify-center py-8">
            <svg className="animate-spin h-6 w-6 text-[#A32638]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          </div>
        )}

        <div ref={sentinelRef} className="h-1" />
      </section>

      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
      )}
    </div>
  );
}