import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserAuthContextProvider } from "./Auth.js";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  </React.StrictMode>
);
