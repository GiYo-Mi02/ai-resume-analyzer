import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => ([
    { title: 'Resumind | Auth' },
    { name: 'description', content: 'Log into your account' },
])

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Fix the redirect logic
    const getRedirectPath = () => {
        const urlParams = new URLSearchParams(location.search);
        const next = urlParams.get('next');
        return next || '/'; // Default to home page if no next parameter
    };

    useEffect(() => {
        if(auth.isAuthenticated) {
            const redirectPath = getRedirectPath();
            console.log('Redirecting to:', redirectPath); // Debug log
            navigate(redirectPath);
        }
    }, [auth.isAuthenticated, navigate, location.search])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
            {/* Animated background elements */}
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 md:w-180 h-40 sm:h-80 md:h-180 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-60 md:w-100 h-32 sm:h-60 md:h-100 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 w-full max-w-[450px] sm:max-w-md mx-auto animate-slide-up px-2">
                <div className="backdrop-blur-sm bg-white/90 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl animate-float"
                     style={{ animationDelay: '0.2s' }}>
                    {/* Header with gradient */}
                    <div className="bg-white p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-white"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-black/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 backdrop-blur-sm transform transition-transform duration-300 hover:scale-110">
                                <svg className="w-8 sm:w-10 h-8 sm:h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 transform transition-all duration-300">Welcome to Resumind</h1>
                            <p className="text-black text-sm sm:text-base md:text-lg transform transition-all duration-300">Continue your job journey with AI-powered resume analysis</p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-16 sm:w-32 h-16 sm:h-32 bg-white/5 rounded-full -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-12 sm:w-24 h-12 sm:h-24 bg-white/5 rounded-full translate-y-6 sm:translate-y-12 -translate-x-6 sm:-translate-x-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {auth.isAuthenticated ? 'You\'re signed in!' : 'Sign in to get started'}
                            </h2>
                            <p className="text-gray-600">
                                {auth.isAuthenticated 
                                    ? 'Ready to analyze your resume and get feedback' 
                                    : 'Unlock personalized resume insights and ATS scoring'
                                }
                            </p>
                        </div>

                        {/* Action Button */}
                        <div className="space-y-4">
                            {isLoading ? (
                                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 opacity-75 cursor-not-allowed">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing you in...</span>
                                </button>
                            ) : (
                                <>
                                    {auth.isAuthenticated ? (
                                        <div className="space-y-4">
                                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-green-800 font-medium">Successfully authenticated</p>
                                                    <p className="text-green-600 text-sm">Redirecting you now...</p>
                                                </div>
                                            </div>
                                            <button 
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
                                                onClick={() => navigate(getRedirectPath())}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                                <span>Continue to Dashboard</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 group"
                                            onClick={auth.signIn}
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Sign In to Continue</span>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Features list */}
                            {!auth.isAuthenticated && (
                            <div className="space-y-3 transform transition-all duration-500" style={{ animationDelay: '0.4s' }}>
                                <p className="text-xs sm:text-sm font-medium text-gray-700 text-center">What you'll get access to:</p>
                                <div className="space-y-2 justify-center">
                                    {[
                                        { 
                                            iconSrc: "/images/analytics.svg", 
                                            text: "AI-powered ATS scoring",
                                            color: "text-blue-600" 
                                        },
                                        { 
                                            iconSrc: "/images/lightbulb.svg", 
                                            text: "Personalized improvement tips",
                                            color: "text-yellow-500" 
                                        },
                                        { 
                                            iconSrc: "/images/target.svg", 
                                            text: "Job-specific resume analysis",
                                            color: "text-green-900" 
                                        },
                                        { 
                                            iconSrc: "/images/landscape-up.svg", 
                                            text: "Performance tracking",
                                            color: "text-purple-600" 
                                        }
                                    ].map((feature, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center space-x-3 text-gray-600 text-xs sm:text-sm transform transition-all duration-300 hover:text-gray-800 hover:scale-105 cursor-default animate-slide-up"
                                            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                        >
                                            <div className="flex-shrink-0 w-6 sm:w-7 h-6 sm:h-7 bg-gray-50 rounded-full flex items-center justify-center transform transition-transform duration-200 hover:scale-125">
                                                <img 
                                                    src={feature.iconSrc} 
                                                    alt=""
                                                    className={`w-4 sm:w-5 h-4 sm:h-5 ${feature.color}`}
                                                />
                                            </div>
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-center transform transition-all duration-300 hover:bg-gray-100">
                        <p className="text-gray-500 text-xs sm:text-sm">
                            Secure authentication powered by{" "}
                            <span className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-default">Puter</span>
                        </p>
                        <div className="flex justify-center space-x-1 mt-2">
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Auth