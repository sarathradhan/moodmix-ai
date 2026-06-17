/**
 * Top navigation bar — logo, Home, History (if logged in), user label, Logout.
 * Shows Log in / Sign up links when there is no user in AppContext.
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants.js';
import { useAppContext } from '../../context/AppContext.jsx';
import Button from '../common/Button.jsx';

function Header() {
  const { user, logout } = useAppContext();

  return (
    <header className="border-b border-slate-700 bg-slate-900/80">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="text-xl font-bold text-moodmix-primary">
          MoodMix
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link to={ROUTES.HOME}>Home</Link>
          {user && <Link to={ROUTES.HISTORY}>History</Link>}
          {user ? (
            <>
              <span className="text-slate-400 hidden sm:inline">
                {user.displayName || user.email}
              </span>
              <Button variant="secondary" onClick={logout} className="!py-1 !px-3 text-xs">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>Log in</Link>
              <Link to={ROUTES.SIGNUP} className="text-moodmix-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
