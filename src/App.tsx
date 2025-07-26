import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Outlet />
    </div>
  );
}

export default App;
