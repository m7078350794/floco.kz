export function SkeletonCard() {
  return (
    <div className="rounded-[var(--radius-card)] overflow-hidden">
      <div className="skeleton aspect-[3/4] w-full" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-10 w-full rounded-[var(--radius-button)]" />
      </div>
    </div>
  );
}

export function SkeletonLine({ width = '100%' }: { width?: string }) {
  return <div className="skeleton h-4 rounded" style={{ width }} />;
}

export function SkeletonImage() {
  return <div className="skeleton w-full h-full rounded-[var(--radius-card)]" />;
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
