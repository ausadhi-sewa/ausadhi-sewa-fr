import { Outlet } from 'react-router-dom';
;
import { Footer } from './components/outlets/footer';
import { Navbar } from './components/outlets/navbar';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-transparent via-medical-green-200 to-transparent flex flex-col">
      <Navbar/>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
