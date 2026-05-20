import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ showSidebar = true }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-surface text-text-primary selection:bg-white/20 relative overflow-hidden flex flex-col">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
            </div>

            <Navbar />

            <div className="flex-1 flex overflow-hidden pt-16 relative z-10">
                {showSidebar && <Sidebar />}
                
                <main className="flex-1 overflow-y-auto pb-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="p-4 lg:p-8 max-w-screen-2xl mx-auto min-h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
