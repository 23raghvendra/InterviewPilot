import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h1>
                        <p className="text-text-secondary mb-8">
                            An unexpected error occurred. Please try again or return to the dashboard.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button
                                onClick={this.handleRetry}
                                className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} /> Try Again
                            </button>
                            <Link
                                to="/dashboard"
                                className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-900/5 transition-colors flex items-center justify-center gap-2"
                            >
                                <Home size={16} /> Go to Dashboard
                            </Link>
                        </div>
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mt-8 p-4 bg-gray-900/5 rounded-xl text-left">
                                <p className="text-xs font-mono text-red-500 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
