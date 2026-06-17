/**
 * Centered loading indicator — used during auth check and history fetch.
 */
function LoadingSpinner() {
  return (
    <div className="flex justify-center py-8" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-moodmix-primary border-t-transparent" />
    </div>
  );
}

export default LoadingSpinner;
