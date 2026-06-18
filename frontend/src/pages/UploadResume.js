import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiFile, FiX, FiCheck, FiZap } from 'react-icons/fi';
import { MdAutoAwesome } from 'react-icons/md';

const steps = [
  { id: 1, label: 'Upload Resume', desc: 'Select your PDF or DOCX file' },
  { id: 2, label: 'Processing', desc: 'Extracting text from your resume' },
  { id: 3, label: 'AI Analysis', desc: 'Gemini AI is analyzing your resume' },
  { id: 4, label: 'Complete', desc: 'Results are ready!' },
];

const UploadResume = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error(rejected[0].errors[0]?.message || 'File not accepted. Use PDF or DOCX.');
      return;
    }
    if (accepted.length > 0) {
      setFile(accepted[0]);
      toast.success('File ready to upload!');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleSubmit = async () => {
    if (!file) return toast.error('Please select a file first');

    setUploading(true);
    setCurrentStep(2);
    setStatusMsg('Uploading and extracting text from your resume...');

    try {
      // Step 1: Upload
      const formData = new FormData();
      formData.append('resume', file);
      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { analysisId } = uploadRes.data;
      setCurrentStep(3);
      setStatusMsg('Gemini AI is analyzing your resume... This takes 15-30 seconds.');
      setUploading(false);
      setAnalyzing(true);

      // Step 2: Analyze
      const analyzeRes = await api.post('/resume/analyze', { analysisId });
      setCurrentStep(4);
      setStatusMsg('Analysis complete! Redirecting to results...');

      await new Promise(r => setTimeout(r, 1000));
      toast.success('Resume analyzed successfully! 🎉');
      navigate(`/results/${analyzeRes.data.analysis._id}`);

    } catch (err) {
      setCurrentStep(1);
      setUploading(false);
      setAnalyzing(false);
      setStatusMsg('');
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const isProcessing = uploading || analyzing;
  const formatSize = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-100 items-center justify-center mb-4">
            <MdAutoAwesome className="text-blue-600 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Analyze Your Resume</h1>
          <p className="text-gray-500 mt-2">Upload your resume to get an instant ATS score and AI-powered suggestions</p>
        </div>

        {/* Progress steps */}
        <div className="card mb-6">
          <div className="flex items-center">
            {steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    currentStep > step.id ? 'bg-green-500 text-white' :
                    currentStep === step.id ? 'bg-blue-600 text-white' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {currentStep > step.id ? <FiCheck className="text-xs" /> : step.id}
                  </div>
                  <p className={`text-xs mt-1 font-medium hidden sm:block ${currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          {statusMsg && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                {isProcessing && <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin inline-block" />}
                {statusMsg}
              </p>
            </div>
          )}
        </div>

        {/* Upload zone */}
        {!isProcessing && (
          <>
            <div
              {...getRootProps()}
              className={`card border-2 border-dashed cursor-pointer transition-all duration-200 text-center py-12 ${
                isDragActive ? 'border-blue-500 bg-blue-50' :
                file ? 'border-green-400 bg-green-50' :
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-3">
                    <FiFile className="text-green-600 text-2xl" />
                  </div>
                  <p className="font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatSize(file.size)}</p>
                  <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                    <FiCheck /> File ready for analysis
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <FiUploadCloud className={`text-2xl ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">
                    {isDragActive ? 'Drop your resume here!' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Supports PDF and DOCX • Max 5MB</p>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setFile(null)}
                  className="btn-secondary flex items-center gap-2 flex-1"
                >
                  <FiX /> Remove File
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex items-center gap-2 flex-1"
                >
                  <FiZap /> Analyze Resume
                </button>
              </div>
            )}

            {/* Tips */}
            <div className="mt-6 card bg-blue-50 border-blue-100">
              <h4 className="font-semibold text-blue-900 text-sm mb-3">💡 For best results:</h4>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li>• Use a text-based PDF (not a scanned image)</li>
                <li>• Include clear sections: Summary, Skills, Experience, Education</li>
                <li>• Use standard headings that ATS can recognize</li>
                <li>• Avoid tables and graphics that can confuse ATS</li>
              </ul>
            </div>
          </>
        )}

        {/* Processing animation */}
        {isProcessing && (
          <div className="card text-center py-16">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-3 flex items-center justify-center">
                  <MdAutoAwesome className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {analyzing ? 'AI is analyzing your resume...' : 'Processing your file...'}
            </h3>
            <p className="text-sm text-gray-500">
              {analyzing
                ? 'Gemini AI is reviewing every section of your resume. Please wait...'
                : 'Extracting text and preparing for analysis...'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
