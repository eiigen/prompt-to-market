import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Extract API key from URL fragment BEFORE React Router processes it.
// BYOP callback: https://eiigen.github.io/prompt-to-market/#api_key=sk_...
// HashRouter would interpret #api_key as a route — extract and clean first.
const hash = window.location.hash;
if (hash.includes('api_key=')) {
  const params = new URLSearchParams(hash.slice(1));
  const apiKey = params.get('api_key');
  if (apiKey) {
    localStorage.setItem('pollinations_api_key', apiKey);
    // Clean the URL — remove fragment entirely
    window.history.replaceState(null, '', window.location.pathname);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
