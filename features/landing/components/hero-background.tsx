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
        className="pointer-events-none absolute left-1/2 top-16 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-signal/8 blur-[120px] transition-transform duration-500 [transform:translate3d(calc(-50%_+_var(--pointer-x,0px)),var(--pointer-y,0px),0)] motion-reduce:transform-[translateX(-50%)]"
        aria-hidden="true"
      />
    </>
  );
}
