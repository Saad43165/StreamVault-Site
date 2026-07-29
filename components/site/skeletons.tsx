import { Skeleton } from '@/components/ui/skeleton';

export function SectionRowSkeleton() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-48 mb-3" />
      <div className="flex gap-3 sm:gap-4 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="shrink-0 w-[140px] sm:w-[160px] md:w-[180px] aspect-[2/3] rounded-xl" />
        ))}
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] min-h-[500px] w-full">
      <Skeleton className="absolute inset-0" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 space-y-4">
        <Skeleton className="h-10 w-2/3 sm:w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="pt-16">
      <Skeleton className="w-full h-[50vh] min-h-[400px]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-32 relative">
        <div className="flex flex-col sm:flex-row gap-6">
          <Skeleton className="w-40 sm:w-48 aspect-[2/3] rounded-xl shrink-0" />
          <div className="flex-1 space-y-4 pt-4">
            <Skeleton className="h-9 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-36" />
              <Skeleton className="h-11 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 pt-24">
      <Skeleton className="h-12 w-full max-w-2xl mb-6" />
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
        ))}
      </div>
    </div>
  );
}
