import { subtleGrid } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function HeroBackground() {
  return (
    <>
      <div
        className={cn(
          subtleGrid,
          'pointer-events-none absolute inset-x-0 top-0 h-[46rem] [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-70',
        )}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-signal/10 blur-[120px]"
        aria-hidden="true"
      />
    </>
  );
}
