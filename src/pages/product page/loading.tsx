export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div 
        className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"
        role="status"
        aria-label="Loading"
      />
      <p className="mt-4 text-lg text-gray-600 font-semibold">Loading...</p>
    </div>
  );
}
