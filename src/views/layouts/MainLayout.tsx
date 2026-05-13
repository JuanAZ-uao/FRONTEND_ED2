import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MainLayout() {
  return (
    <div className="app-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-grid" />
      <Navbar />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
