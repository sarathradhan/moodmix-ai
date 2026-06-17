/**
 * Login page (/login) — email/password form, calls authApi.login.
 * On success sets user in context and redirects to prior page (from ProtectedRoute) or Home.
 */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { authApi } from '../../services/api.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { ROUTES } from '../../utils/constants.js';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || ROUTES.HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.login({ email, password });
      setUser(data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Log in</h1>
      <p className="text-slate-400 text-sm text-center">
        Sign in to analyze your mood and view your personal history.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-slate-400 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-2 text-white"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-slate-400 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-2 text-white"
            autoComplete="current-password"
          />
        </div>
        <ErrorMessage message={error} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        New here?{' '}
        <Link to={ROUTES.SIGNUP} className="text-moodmix-primary hover:underline">
          Create an account
        </Link>
      </p>
    </section>
  );
}

export default Login;
