/**
 * Central route table — maps URL paths to page components.
 * Home, Results, and History are wrapped in ProtectedRoute (login required).
 * Login and Signup are public.
 */
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home.jsx';
import Results from '../pages/Results/Results.jsx';
import Login from '../pages/Login/Login.jsx';
import Signup from '../pages/Signup/Signup.jsx';
import History from '../pages/History/History.jsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx';

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
    />
    <Route
      path="/results"
      element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      }
    />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route
      path="/history"
      element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
