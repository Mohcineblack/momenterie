export default function CollectionLoading() {
  return (
    <div className="w-full px-6 md:px-[48px] py-12 md:py-24 max-w-[1280px] mx-auto">
      <div className="text-center mb-16">
        <div className="h-10 bg-surface-container w-64 mx-auto mb-4 animate-pulse" />
        <div className="h-5 bg-surface-container w-96 mx-auto animate-pulse" />
      </div>

      <div className="border-b border-outline-variant pb-4 mb-12">
        <div className="h-4 bg-surface-container w-24 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="aspect-[4/5] w-full border border-outline-variant p-2 mb-6">
              <div className="w-full h-full bg-surface-container animate-pulse" />
            </div>
            <div className="h-3 bg-surface-container w-24 mb-2 animate-pulse" />
            <div className="h-3 bg-surface-container w-16 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
