import React, { useState, useRef, useCallback } from 'react';
import { uploadItem } from '../services/mockNetworkService';
import { analyzeContent } from '../services/geminiService';
import { ItemType } from '../types';

interface Props {
  onUpload: () => void;
}

const InputArea: React.FC<Props> = ({ onUpload }) => {
  const [text, setText] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY;

  const handleShareText = async () => {
    if (!text.trim()) return;

    // Quick local check
    const isUrl = /^(http|https):\/\/[^ "]+$/.test(text);

    if (hasApiKey && text.length > 50) {
      // Use AI if key is present and text is substantial
      setIsEnhancing(true);
      const analysis = await analyzeContent(text);
      setIsEnhancing(false);

      if (analysis) {
        uploadItem(analysis.type, analysis.formattedContent, { aiSummary: analysis.summary });
      } else {
        uploadItem(isUrl ? ItemType.LINK : ItemType.TEXT, text);
      }
    } else {
      uploadItem(isUrl ? ItemType.LINK : ItemType.TEXT, text);
    }

    setText('');
    onUpload();
  };

  const processFile = (file: File) => {
    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      const sizeMB = file.size / (1024 * 1024);
      const sizeStr = sizeMB < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB.toFixed(1)} MB`;

      uploadItem(ItemType.FILE, content, {
        fileName: file.name,
        fileSize: sizeStr,
        mimeType: file.type
      });
      setIsProcessingFile(false);
      onUpload();
    };

    reader.onerror = () => {
      setIsProcessingFile(false);
      alert("Failed to read file.");
    }

    // Limit size for this localStorage-based demo
    if (file.size > 2 * 1024 * 1024) { // 2MB limit for base64 storage demo
      alert("For this demo, max file size is 2MB to fit in browser storage.");
      setIsProcessingFile(false);
      return;
    }

    reader.readAsDataURL(file);
  };

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
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto mb-12 relative z-20">
      <div
        className={`relative glass-card rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${dragActive ? 'scale-[1.02] ring-2 ring-blue-500/50' : 'hover:shadow-blue-900/20'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Drag Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-blue-600/90 z-20 flex flex-col items-center justify-center text-white animate-fade-in backdrop-blur-sm">
            <svg className="w-20 h-20 mb-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 className="text-3xl font-bold tracking-tight">Drop file to share instantly</h3>
          </div>
        )}

        <div className="p-1">
          <textarea
            className="w-full h-40 p-6 text-lg text-slate-200 placeholder-slate-400 focus:outline-none resize-none bg-transparent font-light leading-relaxed"
            placeholder="Type content, paste a link, or drag & drop a file..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-t border-white/10 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => e.target.files && processFile(e.target.files[0])}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 tooltip group"
              title="Upload File"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            {text.length > 0 && hasApiKey && (
              <span className="text-xs text-blue-300 font-medium px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20 flex items-center animate-fade-in">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                AI Enhanced
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-xs text-slate-500 hidden sm:block font-medium">
              Expires in 30m
            </div>
            <button
              onClick={handleShareText}
              disabled={(!text.trim() && !isProcessingFile) || isEnhancing || isProcessingFile}
              className={`px-8 py-2.5 rounded-xl font-semibold text-white transition-all shadow-lg transform active:scale-95 ${(!text.trim() && !isProcessingFile)
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:shadow-blue-500/40'
                }`}
            >
              {isEnhancing ? 'Optimizing...' : isProcessingFile ? 'Uploading...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputArea;