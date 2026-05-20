import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
    LayoutDashboard, PlayCircle, History, UserCircle, Trophy, Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/interview/setup', label: 'New Interview', icon: PlayCircle },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar() {
    const { user } = useAuthStore();

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="glass-light backdrop-blur-2xl px-6 py-3 rounded-full border border-gray-300 shadow-2xl flex items-center gap-6"
            >
                {/* Stats subtly integrated */}
                <div className="hidden md:flex items-center gap-4 pr-6 border-r border-gray-300">
                    <div className="flex items-center gap-2" title="Current Streak">
                        <Flame size={16} className="text-text-secondary" />
                        <span className="text-sm font-medium">{user?.streak || 0}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Total Sessions">
                        <Trophy size={16} className="text-text-secondary" />
                        <span className="text-sm font-medium">{user?.totalInterviews || 0}</span>
                    </div>
                </div>

                <nav className="flex items-center gap-2">
                    {navItems.map(({ path, label, icon: Icon }) => (
                        <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) => `
                                relative group flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                                ${isActive ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-gray-900 hover:bg-gray-900/5'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={20} className={isActive ? 'text-surface' : 'text-text-secondary group-hover:text-gray-900'} />
                                    {/* Tooltip */}
                                    <span className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-panel text-xs px-3 py-1.5 rounded-lg border border-gray-300 shadow-lg pointer-events-none whitespace-nowrap">
                                        {label}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </motion.div>
        </div>
    );
}
