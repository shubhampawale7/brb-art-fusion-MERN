import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="w-full">
      {/* Shimmering container with aspect ratio */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
      <div className="mt-4">
        {/* Placeholder for text */}
        <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-2"></div>
        <div className="h-6 w-1/2 rounded bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
