// E-Commerce_Fashion-main/client/src/app/components/SkeletonProductCard.js
export default function SkeletonProductCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}