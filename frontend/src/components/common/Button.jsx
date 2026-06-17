/**
 * Reusable styled button — variants: primary (indigo) or secondary (slate).
 * Forwards extra props (onClick, disabled, type, className) to <button>.
 */
function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-moodmix-primary hover:bg-indigo-500',
    secondary: 'bg-slate-700 hover:bg-slate-600',
  };

  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
