import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { logoutUser } from '../../api/auth.api';
import { Menu, LogOut, User, Bell, Box } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const { toggleSidebar } = useUIStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            toast.success('Logged out successfully');
            navigate('/');
        } catch {
            logout();
            navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 glass-light border-b border-gray-200 backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <button
                            onClick={toggleSidebar}
                            className="p-2.5 rounded-xl hover:bg-gray-900/5 transition-colors lg:hidden text-text-secondary hover:text-gray-900"
                        >
                            <Menu size={20} />
                        </button>
                    )}
                    <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 relative group">
                        <div className="relative w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                            <Box size={18} className="text-surface relative z-10" />
                        </div>
                        <span className="text-xl font-bold tracking-tight hidden sm:block text-gray-900">
                            Interview<span className="text-text-secondary font-medium">Pilot</span>
                        </span>
                    </Link>
                </div>

                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 rounded-full hover:bg-gray-900/5 transition-all duration-300 relative group overflow-hidden">
                            <Bell size={20} className="text-text-muted group-hover:text-gray-900 transition-colors relative z-10" />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-600 z-10" />
                        </button>
                        <div className="flex items-center gap-4 pl-4 border-l border-gray-300">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-semibold text-gray-900 leading-tight tracking-tight">{user?.name}</p>
                                <p className="text-[11px] font-medium text-text-muted tracking-wide uppercase mt-0.5">{user?.targetRole || 'Candidate'}</p>
                            </div>
                            <div className="relative group">
                                <button className="w-9 h-9 rounded-full bg-gray-900/10 border border-gray-300 flex items-center justify-center text-gray-900 font-bold text-sm hover:bg-white hover:text-surface transition-all duration-300">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </button>
                                <div className="absolute right-0 top-full mt-3 w-56 glass rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 border border-gray-200 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                    <div className="px-4 py-3 border-b border-gray-200 mb-1 sm:hidden">
                                        <p className="font-bold text-sm text-gray-900 truncate">{user?.name}</p>
                                        <p className="text-xs text-text-muted truncate">{user?.email}</p>
                                    </div>
                                    <Link to="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium hover:bg-gray-900/5 hover:text-gray-900 text-text-secondary transition-colors">
                                        <User size={16} /> My Settings
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-gray-900 hover:bg-gray-900/5 transition-colors mt-1 border-t border-gray-200">
                                        <LogOut size={16} /> Secure Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link
                        to="/auth"
                        className="px-5 py-2 text-sm font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 tracking-wide"
                    >
                        Sign In Access
                    </Link>
                )}
            </div>
        </header>
    );
}
