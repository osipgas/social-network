// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { BrowserRouter } from 'react-router-dom'; // <-- УДАЛИ ИМПОРТ

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* ОСТАВЬ ТОЛЬКО <App /> */}
    <App /> 
  </React.StrictMode>
);