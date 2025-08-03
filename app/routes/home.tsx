import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isWiping, setIsWiping] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  const loadFiles = async () => {
    try {
      const files = (await fs.readDir("./")) as FSItem[];
      setFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    }
  };

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
      ))

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes();
    loadFiles();
  }, []);

  const handleWipeData = async () => {
    try {
      setIsWiping(true);
      
      // Delete all files
      await Promise.all(
        files.map(async (file) => {
          try {
            await fs.delete(file.path);
          } catch (error) {
            console.error(`Error deleting file ${file.path}:`, error);
          }
        })
      );
      
      // Flush KV store
      await kv.flush();
      
      // Update local state
      setResumes([]);
      setFiles([]);
      
      // Show success message
      setStatusText(`Successfully wiped all app data`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatusText('');
      }, 3000);
      
    } catch (err: any) {
      console.error('Wipe data error:', err);
      setStatusText('Failed to delete data. Please try again.');
      setTimeout(() => {
        setStatusText('');
      }, 3000);
    } finally {
      setIsWiping(false);
      setShowWipeConfirm(false);
    }
  };

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
    <Navbar />

    <section className="main-section px-2 sm:px-4">
      <div className="page-heading py-8 sm:py-12 md:py-16 relative max-w-7xl mx-auto">
        
        {/* Wipe Data Button - Only show if there are resumes */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="absolute top-4 right-4">
            <button 
              onClick={() => setShowWipeConfirm(true)}
              disabled={isWiping}
              className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100 flex items-center space-x-2 shadow-lg text-xs sm:text-sm"
            >
              <svg className="w-3 sm:w-4 h-3 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">Wipe All Data</span>
              <span className="sm:hidden">Wipe</span>
            </button>
          </div>
        )}

        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
          Track Your Applications & Resume Ratings
        </h1>
        
        {!loadingResumes && resumes?.length === 0 ? (
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-600">
              No resumes found. Upload your first resume to get feedback.
            </h2>
        ): (
          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl text-gray-600">
            Review your submissions and check AI-powered feedback.
          </h2>
        )}

        {/* Success/Status Message */}
        {statusText && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4 flex items-center justify-center space-x-3 max-w-md mx-auto">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-green-800 font-medium text-sm sm:text-base">{statusText}</span>
          </div>
        )}
      </div>

      {/* Wipe Confirmation Modal */}
      {showWipeConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl border border-gray-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.633 0L2.5 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Wipe All App Data?</h3>
              <p className="text-gray-600 text-sm mb-2">
                This will permanently delete:
              </p>
              <ul className="text-gray-600 text-sm mb-4 text-left">
                <li>• All {resumes.length} stored resume{resumes.length !== 1 ? 's' : ''}</li>
                <li>• All uploaded files ({files.length} file{files.length !== 1 ? 's' : ''})</li>
                <li>• All analysis data</li>
              </ul>
              <p className="text-red-600 text-sm font-medium mb-6">
                This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowWipeConfirm(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleWipeData}
                  disabled={isWiping}
                  className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isWiping ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Wiping...</span>
                    </>
                  ) : (
                    <span>Wipe All Data</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loadingResumes && (
          <div className="flex flex-col items-center justify-center px-4">
            <img src="/images/resume-scan-2.gif" className="w-32 sm:w-48 md:w-[200px] max-w-full" alt="Loading..." />
          </div>
      )}

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section px-2 sm:px-4">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-6 sm:mt-8 md:mt-10 gap-4 px-4">
            <Link to="/upload" className="primary-button w-fit text-base sm:text-lg md:text-xl font-semibold px-6 sm:px-8 py-3 sm:py-4">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}