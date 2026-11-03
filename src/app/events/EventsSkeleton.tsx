"use client";

function SkeletonCard() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 h-full flex flex-col animate-pulse" role="status" aria-busy="true" aria-label="Loading event">
      <div className="relative h-48 w-full overflow-hidden bg-base-200">
        <div className="absolute inset-0 bg-gradient-to-r from-base-200 via-base-300 to-base-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="card-body flex flex-col flex-1 p-4 space-y-3">
        <div className="h-6 w-3/4 bg-base-200 rounded" />
        <div className="space-y-2">
          <div className="h-4 w-1/2 bg-base-200 rounded" />
          <div className="h-4 w-2/3 bg-base-200 rounded" />
          <div className="h-4 w-1/3 bg-base-200 rounded" />
        </div>
        <div className="h-10 w-full mt-auto bg-base-200 rounded-lg" />
      </div>
    </div>
  );
}

export function EventsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}