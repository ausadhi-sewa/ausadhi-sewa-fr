import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/store';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';

// Callback component for Google OAuth
const AuthCallback = () => {
  console.log('🔵 [AUTH CALLBACK] Callback component rendered');
  console.log('🔵 [AUTH CALLBACK] Current URL:', window.location.href);
  console.log('🔵 [AUTH CALLBACK] URL search params:', window.location.search);
  console.log('🔵 [AUTH CALLBACK] URL hash:', window.location.hash);
  
  // This component will be rendered if the backend redirects here
  // You can add logic to handle the callback if needed
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Authentication...</h1>
        <p>Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignUpPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/auth/callback',
        element: <AuthCallback />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
