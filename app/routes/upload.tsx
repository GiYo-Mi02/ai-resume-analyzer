import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
        setError(null); // Clear any previous errors
    }

    const resetForm = () => {
        setIsProcessing(false);
        setStatusText('');
        setError(null);
        setFile(null);
        // Reset form fields
        const form = document.getElementById('upload-form') as HTMLFormElement;
        if (form) form.reset();
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        try {
            setIsProcessing(true);
            setError(null);

            setStatusText('Uploading the file...');
            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                throw new Error('Failed to upload file');
            }

            setStatusText('Converting to image...');
            const imageFile = await convertPdfToImage(file);
            if(!imageFile.file) {
                const errorMessage = imageFile.error || 'Failed to convert PDF to image';
                throw new Error(errorMessage);
            }

            setStatusText('Uploading the image...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) {
                throw new Error('Failed to upload image');
            }

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText('Analyzing with AI...');

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) {
                throw new Error('Failed to analyze resume - no response from AI service');
            }

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText('Analysis complete, redirecting...');
            console.log(data);
            navigate(`/resume/${uuid}`);

        } catch (err: any) {
            console.error('Analysis error:', err);
            setIsProcessing(false);
            
            // Handle specific error types
            let errorMessage = 'An unexpected error occurred';
            
            if (err?.error?.message) {
                // Handle Puter API errors
                const apiError = err.error.message;
                if (apiError.includes('Permission denied') || apiError.includes('usage-limited')) {
                    errorMessage = 'AI analysis limit reached. Please try again later or contact support for increased limits.';
                } else if (apiError.includes('Error 400')) {
                    errorMessage = 'Invalid request. Please check your inputs and try again.';
                } else {
                    errorMessage = `API Error: ${apiError}`;
                }
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            setError(errorMessage);
            setStatusText('');
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        
        const form = e.currentTarget;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        // Validation
        if (!companyName.trim()) {
            setError('Please enter a company name');
            return;
        }
        
        if (!jobTitle.trim()) {
            setError('Please enter a job title');
            return;
        }
        
        if (!jobDescription.trim()) {
            setError('Please enter a job description');
            return;
        }

        if (!file) {
            setError('Please upload your resume');
            return;
        }

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16 max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Smart feedback for your dream job
                        </h1>
                        {isProcessing ? (
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                    <h2 className="text-xl font-semibold text-gray-800">{statusText}</h2>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
                                    </div>
                                    <p className="text-gray-600 text-center max-w-md">
                                        Our AI is carefully analyzing your resume against the job requirements. This may take a few moments.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl text-gray-600 mb-8">
                                    Drop your resume for an ATS score and improvement tips
                                </h2>
                                
                                {/* Error Display */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-start space-x-3">
                                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-red-800 font-medium">Error</h3>
                                            <p className="text-red-700 text-sm mt-1">{error}</p>
                                            <button 
                                                onClick={() => setError(null)}
                                                className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Main Form */}
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                                    <form id="upload-form" onSubmit={handleSubmit} className="space-y-6">
                                        <div className="flex flex-wrap gap-6">
                                            <div className="form-div">
                                                <label htmlFor="company-name" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Company Name *
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="company-name" 
                                                    placeholder="e.g., Google, Microsoft" 
                                                    id="company-name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                            <div className="form-div">
                                                <label htmlFor="job-title" className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Job Title *
                                                </label>
                                                <input 
                                                    type="text" 
                                                    name="job-title" 
                                                    placeholder="e.g., Software Engineer, Product Manager" 
                                                    id="job-title"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="job-description" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Job Description *
                                            </label>
                                            <textarea 
                                                rows={5} 
                                                name="job-description" 
                                                placeholder="Paste the full job description here including requirements, qualifications, and responsibilities..." 
                                                id="job-description"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                                required
                                            />
                                        </div>

                                        <div className="form-div">
                                            <label htmlFor="uploader" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Upload Resume * (PDF only)
                                            </label>
                                            <FileUploader onFileSelect={handleFileSelect} />
                                            {file && (
                                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-green-800 text-sm font-medium">{file.name}</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFile(null)}
                                                        className="text-green-600 hover:text-green-800 ml-auto"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <button 
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                                            type="submit"
                                            disabled={!file || isProcessing}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                            </svg>
                                            <span>Analyze Resume</span>
                                        </button>

                                        {error && (
                                            <div className="flex justify-center">
                                                <button 
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                                                >
                                                    Reset form and try again
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Upload