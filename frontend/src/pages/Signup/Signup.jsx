/**
 * Signup page (/signup) — register with email, password, optional display name.
 * On success sets user in context and navigates to Home.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { authApi } from '../../services/api.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { ROUTES } from '../../utils/constants.js';

function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await authApi.signup({ email, password, displayName });
      setUser(data.user);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Create account</h1>
      <p className="text-slate-400 text-sm text-center">
        Your mood history is saved to your account only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm text-slate-400 mb-1">
            Display name (optional)
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-2 text-white"
            autoComplete="name"
          />
        </div>
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
            Password (min 8 characters)
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-2 text-white"
            autoComplete="new-password"
          />
        </div>
        <ErrorMessage message={error} />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-moodmix-primary hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}

export default Signup;
