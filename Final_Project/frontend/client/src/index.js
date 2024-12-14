import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure this ID matches the one in public/index.html
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('No root element found. Please check the index.html file.');
}
