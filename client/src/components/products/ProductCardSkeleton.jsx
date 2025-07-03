import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="block relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-md border border-gray-100">
      {/* Image Area Skeleton */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>

      {/* Out of Stock Badge Skeleton (if applicable, can be hidden if you don't want it to show during loading) */}
      {/* If you want to show a badge placeholder: */}
      {/* <div className="absolute top-4 left-4 h-6 w-24 bg-gray-300 rounded-full animate-pulse z-10"></div> */}

      {/* Content Overlay Skeleton (always visible - name, price, rating) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-95 backdrop-blur-sm z-10">
        {/* Product Name Skeleton */}
        <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse mb-2"></div>

        {/* Price & Rating Skeleton */}
        <div className="flex items-center justify-between mt-2">
          {/* Price Skeleton */}
          <div className="h-6 w-1/3 rounded bg-gray-200 animate-pulse"></div>
          {/* Rating Skeleton */}
          <div className="h-4 w-1/4 rounded bg-gray-200 animate-pulse"></div>
        </div>
      </div>

      {/* Hover Overlay Buttons Skeleton (hidden by default, consistent with real card) */}
      {/* These should typically NOT be visible on a skeleton loader, as they only appear on hover */}
      {/* If you want placeholders for them to quickly pop in, you'd replicate the button shapes: */}
      {/*
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-20">
        <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse"></div>
        <div className="h-10 w-28 rounded-full bg-gray-300 animate-pulse"></div>
      </div>
      */}
    </div>
  );
};

export default ProductCardSkeleton;
