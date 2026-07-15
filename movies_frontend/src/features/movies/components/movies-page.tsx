'use client';

import { useState, type SubmitEvent } from 'react';
import Link from 'next/link';
import { Bebas_Neue, Inter } from 'next/font/google';
import { useSearchMovies } from '@/features/movies/hooks/searchMovies';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

export function MovieSearch() {
  const [query, setQuery] = useState('');
  const { search, results, isLoading, error, hasSearched } = useSearchMovies();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) search(query);
  }

  return (
    <div className={`${body.className} min-h-screen bg-[#14141A] bg-[radial-gradient(ellipse_at_top,_#1F1E29_0%,_#14141A_55%)]`}>
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className={`${display.className} text-2xl tracking-[0.15em] text-[#F6F1E7]`}>
          OCTAGRAM
        </span>
        <Link
          href="/login"
          className="rounded-full border border-[#A32638] px-5 py-2 text-sm font-medium text-[#F6F1E7] transition hover:bg-[#A32638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A]"
        >
          Log in
        </Link>
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
            className="rounded-full bg-[#A32638] px-6 py-3 text-sm font-semibold text-[#F6F1E7] transition hover:bg-[#7E1D2B] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A32638] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14141A]"
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
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group">
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
              <p className="text-xs text-[#8A8477]">
                {movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown year'}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}