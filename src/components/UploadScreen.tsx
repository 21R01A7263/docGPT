
import React, { useCallback, useState } from 'react';
import { UploadIcon, FileIcon } from './icons';

interface UploadScreenProps {
  onFileUpload: (file: File) => void;
  isParsing: boolean;
}

const UploadScreen: React.FC<UploadScreenProps> = ({ onFileUpload, isParsing }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
       onFileUpload(file);
    } else {
        alert("Unsupported file type. Please upload a PDF or DOCX file.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center" onDragEnter={handleDrag}>
      {isParsing ? (
        <>
            <FileIcon className="w-16 h-16 text-brand-accent animate-pulse mb-4" />
            <h2 className="text-2xl font-bold text-brand-text mb-2">Parsing Document...</h2>
            <p className="text-brand-light">Please wait while we analyze your document.</p>
        </>
      ) : (
        <>
        <form id="form-file-upload" className="w-full h-full" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input type="file" id="input-file-upload" className="hidden" accept=".pdf,.docx" onChange={handleChange} />
            <label htmlFor="input-file-upload" 
                className={`h-full flex flex-col items-center justify-center border-4 border-dashed rounded-xl transition-colors duration-300
                ${dragActive ? 'border-brand-accent bg-brand-accent/20' : 'border-brand-accent/50 hover:border-brand-accent hover:bg-brand-accent/10'}`}>
                <UploadIcon className="w-20 h-20 text-brand-light mb-4" />
                <h2 className="text-3xl font-bold text-brand-text mb-2">DocuChat AI</h2>
                <p className="text-brand-light mb-1">Drag & drop your document here</p>
                <p className="text-sm text-brand-accent mb-4">(PDF or DOCX)</p>
                <p className="text-brand-light">or</p>
                <button type="button" onClick={() => document.getElementById('input-file-upload')?.click()} className="mt-4 px-6 py-2 bg-brand-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors">
                    Browse File
                </button>
            </label>
            {dragActive && <div className="absolute w-full h-full top-0 right-0 bottom-0 left-0" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>
        </>
      )}
    </div>
  );
};

export default UploadScreen;
