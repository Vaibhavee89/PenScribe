import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from './ui/Toaster';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;