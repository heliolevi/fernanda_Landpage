import { lazy, Suspense } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

/**
 * Slot para uma cena Spline.
 * Para ativar: publique uma cena no Spline (Export > Code > "React"), copie a URL .splinecode
 * e defina VITE_SPLINE_SCENE=<url> em .env. Sem a variável, o componente não renderiza nada
 * e o carregamento do runtime do Spline nem acontece (import preguiçoso).
 */
export function SplineSlot({ className }: { className?: string }) {
  const url = import.meta.env.VITE_SPLINE_SCENE as string | undefined;
  if (!url) return null;
  return (
    <div className={className} aria-hidden="true">
      <Suspense fallback={null}>
        <Spline scene={url} />
      </Suspense>
    </div>
  );
}
