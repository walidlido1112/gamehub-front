// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // تعديل هنا ليكون المسار الصحيح
import './index.css';  // إذا كنت تستخدم CSS

const rootElement = document.getElementById('root') as HTMLElement;

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
