import { body } from '@/lib/fonts';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${body.className} min-h-screen flex items-center justify-center bg-[#14141A] bg-[radial-gradient(ellipse_at_top,_#1F1E29_0%,_#14141A_60%)] px-4`}>
      <div className="relative w-full max-w-sm motion-safe:animate-[fadeIn_0.4s_ease-out]">
        <div className="absolute -top-2 left-0 right-0 flex justify-center gap-3 px-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="h-3 w-3 rounded-full bg-[#14141A]" />
          ))}
        </div>

        <div className="rounded-2xl bg-[#F6F1E7] px-8 pt-9 pb-8 shadow-[0_20px_60px_-15px_rgba(163,38,56,0.35)]">
          {children}
        </div>
      </div>
    </div>
  );
}