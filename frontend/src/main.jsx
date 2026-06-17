/**
 * Entry point — mounts the React app into #root.
 * Wraps App in StrictMode and BrowserRouter so routing works app-wide.
 * Redirects localhost → 127.0.0.1 (legacy note for Spotify cookie compatibility).
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/index.css';

// localhost and 127.0.0.1 are different sites — Spotify cookies require 127.0.0.1
if (window.location.hostname === 'localhost') {
  window.location.replace(
    window.location.href.replace('localhost', '127.0.0.1')
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
