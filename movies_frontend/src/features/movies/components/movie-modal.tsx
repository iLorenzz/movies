'use client';

import { useEffect, useRef, useState } from 'react';
import { Bebas_Neue, Inter } from 'next/font/google';
import { getCookie } from '@/utils/cookies.client';
import { useMovieDetails } from '@/features/movies/hooks/movieDetailsHook';
import { useRating } from '@/features/rating/hooks/ratingHook';


const display = Bebas_Neue({ weight: '400', subsets: ['latin'] });
const body = Inter({ subsets: ['latin'] });

interface Props {
  movieId: string;
  onClose: () => void;
}

export function MovieModal({ movieId, onClose }: Props) {
  const { fetchDetails, details, isLoading, error } = useMovieDetails();
  const { loadRating, rate, removeRating, ratingId, score, isSaving } = useRating();

  const isLoggedIn = Boolean(getCookie('access_token'));
  const [hoverValue, setHoverValue] = useState(0);

  const detailsLoadedFor = useRef<string | null>(null);
  const ratingLoadedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!movieId || detailsLoadedFor.current === movieId) return;
    detailsLoadedFor.current = movieId;
    fetchDetails(movieId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

  useEffect(() => {
    if (!movieId || !isLoggedIn || ratingLoadedFor.current === movieId) return;
    ratingLoadedFor.current = movieId;
    loadRating(movieId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, isLoggedIn]);

  // ESC fecha + trava o scroll do fundo enquanto aberto
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const displayValue = hoverValue || score;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className={`${body.className} relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-[#2A2833] bg-[#1F1E29] p-6 shadow-2xl shadow-black/60`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-[#8A8477] hover:text-[#F6F1E7] transition cursor-pointer"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <svg className="animate-spin h-8 w-8 text-[#A32638]" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
            </svg>
          </div>
        ) : error || !details ? (
          <p role="alert" className="text-[#A32638] py-16 text-center">
            Couldn&apos;t load this movie.
          </p>
        ) : (
          <>
            <h1 className={`${display.className} text-3xl sm:text-4xl tracking-wide text-[#F6F1E7] pr-8`}>
              {details.original_title}
            </h1>
            <p className="text-[#8A8477] mt-1">
              {details.release_date ? details.release_date.slice(0, 4) : 'Unknown year'}
            </p>

            {/* Estrelas */}
            <div className="mt-4">
              <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={!isLoggedIn || isSaving}
                    onClick={() => rate(movieId, n)}
                    onMouseEnter={() => isLoggedIn && setHoverValue(n)}
                    aria-label={`Rate ${n} of 5`}
                    className={`transition ${isLoggedIn ? 'cursor-pointer' : 'cursor-default'} disabled:opacity-100`}
                  >
                    <svg
                      width="28" height="28" viewBox="0 0 24 24"
                      fill={displayValue >= n ? '#E4B04A' : 'none'}
                      stroke={displayValue >= n ? '#E4B04A' : '#5A5750'}
                      strokeWidth="1.5"
                    >
                      <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16.9 5.5 20.5 7 14 2 9.6l6.6-.6z"
                        strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}

                {ratingId !== null && (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={removeRating}
                    className="ml-3 text-xs text-[#8A8477] hover:text-[#A32638] transition cursor-pointer disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}

                {isSaving && (
                  <svg className="animate-spin h-4 w-4 text-[#A32638] ml-2" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                )}
              </div>

              {!isLoggedIn && (
                <p className="text-xs text-[#8A8477] mt-2">Log in to rate this movie.</p>
              )}
            </div>

            {/* Sinopse */}
            <h2 className={`${display.className} text-lg tracking-[0.1em] text-[#F6F1E7] mt-6 mb-1`}>Overview</h2>
            <p className="text-[#C7C1B4] leading-relaxed text-sm">
              {details.overview || 'No overview available.'}
            </p>

            {/* Elenco */}
            {details.credits?.cast?.length > 0 && (
              <>
                <h2 className={`${display.className} text-lg tracking-[0.1em] text-[#F6F1E7] mt-6 mb-1`}>Cast</h2>
                <p className="text-[#C7C1B4] leading-relaxed text-sm">
                  {details.credits.cast.slice(0, 12).map((c) => c.name).join(', ')}
                </p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
