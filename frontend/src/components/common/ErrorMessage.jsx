/**
 * Inline error alert — renders nothing when message is empty.
 * Used for API failures on Home, Login, Signup, and History.
 */
function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <p className="text-red-400 text-sm bg-red-950/40 border border-red-900 rounded-lg px-4 py-2" role="alert">
      {message}
    </p>
  );
}

export default ErrorMessage;
