import './index.css'
import App from './App';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Why is fetching happening 2 times?
// The Reason:
// This is actually normal and intentional behavior in React Development mode. 
// It is caused by <React.StrictMode> in your main.tsx or index.tsx.
// React mounts your components, unmounts them, and mounts them again immediately
//  to check for memory leaks and cleanup bugs.
//
// In Development (localhost): You see 2 requests.
// In Production (real website): You will only see 1 request.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)