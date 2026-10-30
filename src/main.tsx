import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const application = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Unknown SPA fallback paths must not hydrate the homepage's static markup.
if (
  root.hasChildNodes() &&
  root.dataset.prerendered === window.location.pathname.replace(/\/+$/, '')
)
  ReactDOM.hydrateRoot(root, application);
else ReactDOM.createRoot(root).render(application);
