import React from 'react';
import ReactDOM from 'react-dom/client';
import { NotificationProvider } from './components/NotificationProvider';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    
      <NotificationProvider>
        <App />
      </NotificationProvider>
   
  </React.StrictMode>
);