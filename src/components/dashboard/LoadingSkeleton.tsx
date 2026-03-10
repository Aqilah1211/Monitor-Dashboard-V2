export default function LoadingSkeleton() {
  // Komponen untuk menampilkan loading state dengan skeleton screens
  
  return (
    <div className="space-y-8">
      {/* Header dengan loading animation */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-slate-300 rounded-lg animate-pulse" />
        <div className="h-10 w-32 bg-slate-300 rounded-lg animate-pulse" />
      </div>

      {/* Stats Grid - 4 Kartu Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-slate-100 rounded-xl p-6 space-y-3 animate-pulse"
          >
            {/* Label skeleton */}
            <div className="h-4 w-24 bg-slate-300 rounded" />
            
            {/* Value skeleton */}
            <div className="h-8 w-16 bg-slate-300 rounded" />
            
            {/* Subtitle skeleton */}
            <div className="h-3 w-32 bg-slate-300 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Section Skeleton */}
      <div className="bg-slate-100 rounded-xl p-6 space-y-4 animate-pulse">
        {/* Chart title */}
        <div className="h-6 w-56 bg-slate-300 rounded" />
        
        {/* Chart placeholder */}
        <div className="h-64 w-full bg-slate-200 rounded-lg" />
        
        {/* Chart legend */}
        <div className="flex gap-4 mt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-300 rounded-full" />
              <div className="h-3 w-20 bg-slate-300 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Activity Table Skeleton */}
      <div className="bg-slate-100 rounded-xl p-6 space-y-4 animate-pulse">
        {/* Table header */}
        <div className="h-6 w-40 bg-slate-300 rounded" />
        
        {/* Table rows */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center gap-4">
              {/* Checkbox skeleton */}
              <div className="w-4 h-4 bg-slate-300 rounded" />
              
              {/* Row content skeleton */}
              <div className="flex-1 flex gap-4">
                <div className="h-4 w-32 bg-slate-300 rounded" />
                <div className="h-4 w-48 bg-slate-300 rounded" />
                <div className="h-4 w-20 bg-slate-300 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 bg-slate-300 rounded animate-pulse" />
        <div className="flex gap-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-9 w-9 bg-slate-300 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
