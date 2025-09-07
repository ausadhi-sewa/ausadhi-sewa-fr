import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './store/store';

// Import pages
import { HomePage, DashboardPage, ProductDetailsPage, CheckoutPage, OrdersPage, ShopPage, UserProfile, MyOrders, OrderDetails, MyAddresses, Productcategories, NotFoundPage, AboutPage, TermsPage, PrivacyPage, Statistics } from './pages';
import { AuthGate } from './components/auth/AuthGate';
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
        path: '/admin/dashboard',
        element: (
          <AuthGate redirectTo='/admin/dashboard'>
            <DashboardPage />
          </AuthGate>
        ),
      },
      {
        path: '/admin/orders',
        element: (
          <AuthGate redirectTo='/admin/orders'>
            <OrdersPage />
          </AuthGate>
        ),
      },
      {
        path: '/admin/statistics',
        element: (
            <AuthGate redirectTo='/admin/statistics'>
            <Statistics/>
          </AuthGate>
        ),
      },
      {
        path: '/shop',
        element: <ShopPage />,
      },
      
      {
        path: '/category/:categoryId',
        element: <Productcategories />,
      },
      {
        path: '/auth/callback',
        element: <AuthCallback />,
      },
      {
        path: '/product/:id',
        element: <ProductDetailsPage />,
      },
      {
        path: '/checkout',
        element: <CheckoutPage />,
      },
      {
        path: '/profile',
        element: <UserProfile />,
      },
      {
        path: '/orders',
        element: <MyOrders />,
      },
      {
        path: '/orders/:id',
        element: <OrderDetails />,
      },
      {
        path: '/profile/addresses',
        element: <MyAddresses />,
      },
      {
        path: '/products',
        element: <ShopPage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/terms',
        element: <TermsPage />,
      },
      {
        path: '/privacy',
        element: <PrivacyPage />,
      },
      {
        path: '/help',
        element: <NotFoundPage />, // Placeholder - you can create a proper help page later
      },
      {
        path: '/contact',
        element: <NotFoundPage />, // Placeholder - you can create a proper contact page later
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);
