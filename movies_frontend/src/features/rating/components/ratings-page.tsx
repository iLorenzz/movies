'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bebas_Neue, Inter } from 'next/font/google';
import { getCookie } from '@/utils/cookies.client';

import { MovieModal } from '@/features/movies/components/movie-modal'; // AJUSTE o path se o MovieModal estiver em outra pasta
import { useUserRatings } from '../hooks/userRatingHook';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

// 5 estrelas read-only preenchidas até `score`
function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="14" height="14" viewBox="0 0 24 24"
          fill={score >= n ? '#E4B04A' : 'none'}
          stroke={score >= n ? '#E4B04A' : '#5A5750'}
          strokeWidth="1.5"
        >
          <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16.9 5.5 20.5 7 14 2 9.6l6.6-.6z"
            strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  );
}

export default function RatingsPage() {
  const router = useRouter();

  // null = ainda não sabemos (durante SSR / antes de montar).
  // Ler o cookie só no cliente evita quebrar o SSR e hydration mismatch.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const { fetchRatings, ratings, isLoading, error } = useUserRatings();
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const loaded = useRef(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getCookie('access_token')));
  }, []);

  useEffect(() => {
    if (isLoggedIn !== true || loaded.current) return;
    loaded.current = true;
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Ao fechar o modal, recarrega a lista (nota pode ter sido alterada/removida lá dentro)
  function handleModalClose() {
    setSelectedMovieId(null);
    fetchRatings();
  }

  // Enquanto não sabemos se está logado (primeiro paint / SSR), mostra spinner neutro
  if (isLoggedIn === null) {
    return (
      <div className={`${body.className} min-h-screen flex items-center justify-center bg-[#14141A]`}>
        <svg className="animate-spin h-8 w-8 text-[#A32638]" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Acesso exige login
  if (!isLoggedIn) {
    return (
      <div className={`${body.className} min-h-screen flex flex-col items-center justify-center gap-4 bg-[#14141A] text-[#F6F1E7]`}>
        <p className="text-[#8A8477]">You need to be logged in to see your ratings.</p>
        <Link
          href="/login"
          className="rounded-full border border-[#A32638] px-5 py-2 text-sm text-[#F6F1E7] transition hover:bg-[#A32638]"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className={`${body.className} min-h-screen bg-[#14141A] bg-[radial-gradient(ellipse_at_top,_#1F1E29_0%,_#14141A_55%)]`}>
      <header className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <span className={`${display.className} text-2xl tracking-[0.15em] text-[#F6F1E7]`}>OCTAGRAM</span>
        <button
          onClick={() => router.push('/')}
          className="rounded-full border border-[#2A2833] px-5 py-2 text-sm text-[#F6F1E7] transition hover:border-[#A32638] hover:bg-[#A32638] cursor-pointer"
        >
          ← Back
        </button>
      </header>

      <section className="px-6 pb-16 max-w-5xl mx-auto pt-6">
        <h1 className={`${display.className} text-4xl sm:text-5xl tracking-wide text-[#F6F1E7] mb-6`}>
          Rated movies
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-[#A32638]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          </div>
        ) : error ? (
          <p role="alert" className="text-[#A32638]">Couldn&apos;t load your ratings. Try again in a moment.</p>
        ) : ratings.length === 0 ? (
          <p className="text-[#8A8477]">You haven&apos;t rated any movies yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {ratings.map((r) => (
              <button
                key={r.rating_id}
                type="button"
                onClick={() => setSelectedMovieId(String(r.movie_id))}
                className="group text-left cursor-pointer"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#1F1E29]">
                  {r.poster_path ? (
                    <img
                      src={r.poster_path}
                      alt={r.title ?? 'Movie'}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[#8A8477] text-xs text-center px-3">
                      No poster available
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-[#F6F1E7] line-clamp-2">
                  {r.title ?? 'Unknown title'}
                </p>
                <ScoreStars score={r.score} />
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedMovieId && (
        <MovieModal movieId={selectedMovieId} onClose={handleModalClose} />
      )}
    </div>
  );
}