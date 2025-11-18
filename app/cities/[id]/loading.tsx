export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Skeleton */}
      <div className="relative h-[500px] w-full bg-slate-800 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="max-w-7xl mx-auto">
            <div className="h-12 w-64 bg-slate-700 rounded-lg mb-4" />
            <div className="h-6 w-48 bg-slate-700 rounded-lg mb-6" />
            <div className="h-20 w-full max-w-3xl bg-slate-700 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 animate-pulse"
            >
              <div className="h-10 w-10 bg-slate-700 rounded-full mb-4" />
              <div className="h-4 w-20 bg-slate-700 rounded mb-2" />
              <div className="h-8 w-24 bg-slate-700 rounded" />
            </div>
          ))}
        </div>

        {/* Description Skeleton */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-700 rounded mb-4" />
          <div className="h-4 w-full bg-slate-700 rounded" />
          <div className="h-4 w-full bg-slate-700 rounded" />
          <div className="h-4 w-3/4 bg-slate-700 rounded" />
        </div>

        {/* Cost Breakdown Skeleton */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 animate-pulse">
          <div className="h-8 w-48 bg-slate-700 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-6 w-32 bg-slate-700 rounded" />
                <div className="h-6 w-24 bg-slate-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Skeleton */}
        <div className="space-y-6">
          <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-video bg-slate-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
