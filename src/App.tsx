import { Outlet } from 'react-router-dom';
import { Footer } from './components/outlets/footer';
import { Navbar } from './components/outlets/navbar';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
function App() {
  return (
    // <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-r from-transparent via-medical-green-200 to-transparent flex flex-col">
        <Toaster 
          position="top-right" 
          richColors 
          closeButton={true}
          duration={4000}
          expand={true}
        />
        <Navbar/>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    // </ErrorBoundary>
  );
}

export default App;
