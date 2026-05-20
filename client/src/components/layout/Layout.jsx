import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ showSidebar = true }) {
    return (
        <div className="min-h-screen bg-surface text-text-primary selection:bg-white/20 relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
            </div>

            <Navbar />
            {showSidebar && <Sidebar />}

            <main className="pt-24 pb-32 min-h-screen transition-all duration-300 relative z-10">
                <div className="p-4 lg:p-8 max-w-screen-2xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
