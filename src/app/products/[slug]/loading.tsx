export default function ProductLoading() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-[48px] py-12 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Gallery skeleton */}
        <div>
          <div className="aspect-[4/5] bg-surface-container border border-outline-variant p-2 animate-pulse" />
        </div>

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-3 bg-surface-container w-20 animate-pulse" />
          <div className="h-10 bg-surface-container w-3/4 animate-pulse" />
          <div className="h-6 bg-surface-container w-32 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-container w-full animate-pulse" />
            <div className="h-4 bg-surface-container w-5/6 animate-pulse" />
            <div className="h-4 bg-surface-container w-3/4 animate-pulse" />
          </div>
          <div className="h-[140px] bg-surface-container-low border border-outline-variant animate-pulse" />
        </div>
      </div>
    </div>
  );
}
