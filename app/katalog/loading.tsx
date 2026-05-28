function Shimmer({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(90deg, #F1F5F9 0%, #F1F5F9 30%, #E2E8F0 50%, #F1F5F9 70%, #F1F5F9 100%)",
        backgroundSize: "600px 100%",
        animation: "shimmer 2.24s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

function CardSkeleton({ delay }: { delay: number }) {
  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Zdjęcie */}
      <Shimmer className="h-44 w-full rounded-none" style={{ animationDelay: `${delay}s` }} />

      {/* Treść */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* Badge kategoria */}
        <Shimmer
          className="h-5 rounded-full"
          style={{ width: "42%", animationDelay: `${delay + 0.05}s` }}
        />
        {/* Nazwa — linia 1 */}
        <Shimmer
          className="h-3.5 rounded"
          style={{ width: "100%", animationDelay: `${delay + 0.1}s` }}
        />
        {/* Nazwa — linia 2 */}
        <Shimmer
          className="h-3.5 rounded"
          style={{ width: "68%", animationDelay: `${delay + 0.12}s` }}
        />
        {/* Jednostka */}
        <Shimmer
          className="h-3 rounded"
          style={{ width: "30%", animationDelay: `${delay + 0.15}s` }}
        />
        {/* Cena + strzałka */}
        <div className="pt-3 mt-0.5 border-t border-gray-50 flex justify-between items-center">
          <Shimmer
            className="h-3.5 rounded"
            style={{ width: "45%", animationDelay: `${delay + 0.18}s` }}
          />
          <Shimmer
            className="h-3.5 w-3.5 rounded"
            style={{ animationDelay: `${delay + 0.18}s` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function KatalogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
      `}</style>

      {/* Header skeleton */}
      <div className="mb-8 flex flex-col gap-2.5">
        <Shimmer className="h-8 w-48 rounded-lg" />
        <Shimmer className="h-4 w-36 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-5">
            {/* Szukaj */}
            <div className="flex flex-col gap-2">
              <Shimmer className="h-3 w-12 rounded" />
              <Shimmer className="h-9 w-full rounded-lg" />
            </div>
            {/* Kategorie */}
            <div className="flex flex-col gap-1.5">
              <Shimmer className="h-3 w-20 rounded mb-1" />
              {[100, 88, 92, 76, 84, 70, 80, 66].map((w, i) => (
                <Shimmer
                  key={i}
                  className="h-8 rounded-lg"
                  style={{ width: `${w}%`, animationDelay: `${i * 0.06}s` }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
