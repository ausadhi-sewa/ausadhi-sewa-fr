import { Outlet } from 'react-router-dom';
import { Navbar } from './components/outlets/navbar';
function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <Outlet />nm,
    </div>
  );
}

export default App;
