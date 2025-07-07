import React from "react";

export const AmbienteKpiSkeleton: React.FC = () => (
  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <div
        key={i}
        className="animate-pulse bg-gray-100 rounded-lg h-32 flex flex-col items-center justify-center"
      >
        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-8 w-20 bg-gray-300 rounded" />
      </div>
    ))}
  </div>
);

export const AmbienteChartSkeleton: React.FC = () => (
  <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
    {[1, 2].map(i => (
      <div
        key={i}
        className="animate-pulse bg-gray-100 rounded-lg h-64 flex items-center justify-center"
      >
        <div className="h-40 w-40 bg-gray-200 rounded-full" />
      </div>
    ))}
  </div>
);

export const AmbienteBarSkeleton: React.FC = () => (
  <div className="mb-8 animate-pulse bg-gray-100 rounded-lg h-64 flex items-center justify-center">
    <div className="h-40 w-3/4 bg-gray-200 rounded" />
  </div>
);

export const AmbienteLineSkeleton: React.FC = () => (
  <div className="mb-8 animate-pulse bg-gray-100 rounded-lg h-64 flex items-center justify-center">
    <div className="h-40 w-3/4 bg-gray-200 rounded" />
  </div>
);

export const AmbienteTableSkeleton: React.FC = () => (
  <div className="bg-white rounded shadow p-6 animate-pulse">
    <div className="h-6 w-1/2 bg-gray-200 rounded mb-4" />
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex gap-2 mb-2">
        {[...Array(9)].map((_, j) => (
          <div key={j} className="h-4 w-16 bg-gray-100 rounded" />
        ))}
      </div>
    ))}
  </div>
);
