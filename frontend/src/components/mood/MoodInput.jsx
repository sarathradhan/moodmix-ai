/**
 * Controlled textarea for the user's mood description.
 * Props: value, onChange(text), onSubmit (form submit / Enter), disabled while analyzing.
 */
function MoodInput({ value, onChange, onSubmit, disabled }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-4"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe how you feel..."
        rows={4}
        disabled={disabled}
        className="w-full rounded-lg bg-slate-800 border border-slate-600 p-4 focus:outline-none focus:ring-2 focus:ring-moodmix-primary"
      />
    </form>
  );
}

export default MoodInput;
