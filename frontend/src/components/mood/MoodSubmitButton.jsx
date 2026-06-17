/**
 * Primary action on Home — triggers mood analysis via parent onClick.
 * Shows "Analyzing..." when loading; disabled when text is empty or request in flight.
 */
import Button from '../common/Button.jsx';

function MoodSubmitButton({ onClick, loading, disabled }) {
  return (
    <Button onClick={onClick} disabled={loading || disabled}>
      {loading ? 'Analyzing...' : 'Find My Music'}
    </Button>
  );
}

export default MoodSubmitButton;
