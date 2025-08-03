import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useState} from "react";

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await auth.signOut();
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className="navbar px-4 sm:px-6 md:px-10 py-3 sm:py-4">
            <Link to="/">
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/upload" className="primary-button w-fit text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2 sm:py-3">
                    <span className="hidden sm:inline">Upload Resume</span>
                    <span className="sm:hidden">Upload</span>
                </Link>
                
                {auth.isAuthenticated && (
                    <button 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-1 sm:space-x-2 shadow-lg text-xs sm:text-sm"
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="hidden sm:inline">Signing out...</span>
                                <span className="sm:hidden">...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                                <span className="sm:hidden">Out</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </nav>
    )
}
export default Navbar
