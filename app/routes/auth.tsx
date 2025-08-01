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
    const next = location.search.split('next=')[1];
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, next])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-180 h-180 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-green-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 w-full max-w-md mx-auto animate-slide-up">
                <div className="backdrop-blur-sm bg-white/90 rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl animate-float"
                     style={{ animationDelay: '0.2s' }}>
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-white-600 via-white-600 to-white-800 p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-white-600/80 via-white-600/80 to-white-800/80"></div>
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-gray/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm transform transition-transform duration-300 hover:scale-110">
                                <svg className="w-10 h-10 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl text-white-200 font-bold mb-2 transform transition-all duration-300">Welcome to Resumind</h1>
                            <p className="text-gray-800 text-lg transform transition-all duration-300">Continue your job journey with AI-powered resume analysis</p>
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-pulse" style={{ animationDelay: '1s' }}></div>
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
                                                    <p className="text-green-600 text-sm">You can now access all features</p>
                                                </div>
                                            </div>
                                            <button 
                                                className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2"
                                                onClick={auth.signOut}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span>Sign Out</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 group"
                                            onClick={auth.signIn}
                                        >
                                            <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
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
                                <p className="text-sm font-medium text-gray-700 text-center">What you'll get access to:</p>
                                <div className="space-y-2 justify-content-center align-items-center">
                                    {[
                                        { icon: "📊", text: "AI-powered ATS scoring" },
                                        { icon: "💡", text: "Personalized improvement tips" },
                                        { icon: "🎯", text: "Job-specific resume analysis" },
                                        { icon: "📈", text: "Performance tracking" }
                                    ].map((feature, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center space-x-3 text-gray-600 text-sm transform transition-all duration-300 hover:text-gray-800 hover:scale-105 cursor-default animate-slide-up text-center"
                                            style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                        >
                                            <span className="text-lg transform transition-transform duration-200 hover:scale-125">{feature.icon}</span>
                                            <span>{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-4 text-center transform transition-all duration-300 hover:bg-gray-100">
                        <p className="text-gray-500 text-sm">
                            Secure authentication powered by{" "}
                            <span className="font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-default">Puter</span>
                        </p>
                        <div className="flex justify-center space-x-1 mt-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Auth
