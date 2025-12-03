import React, { useState } from 'react';
import { SharedItem, ItemType } from '../types';

interface Props {
  item: SharedItem;
}

const SharedItemCard: React.FC<Props> = ({ item }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const timeLeft = Math.max(0, Math.ceil((item.expiresAt - Date.now()) / 60000));
  const isExpired = timeLeft === 0;

  if (isExpired) return null;

  const renderIcon = () => {
    switch (item.type) {
      case ItemType.FILE:
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case ItemType.LINK:
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case ItemType.CODE:
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        );
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up hover:-translate-y-1 group border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
            {renderIcon()}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-0.5 block">
              {item.type}
            </span>
            {item.fileName && (
              <h3 className="font-medium text-slate-200 truncate max-w-[180px] sm:max-w-xs text-lg">
                {item.fileName}
              </h3>
            )}
            {item.fileSize && (
              <p className="text-xs text-slate-500 font-medium">{item.fileSize}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${timeLeft < 5 ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            {timeLeft}m left
          </span>
        </div>
      </div>

      <div className="bg-black/20 rounded-xl p-4 mb-5 font-mono text-sm text-slate-300 break-all max-h-48 overflow-y-auto border border-white/5 custom-scrollbar">
        {item.type === ItemType.LINK ? (
          <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
            {item.content}
          </a>
        ) : item.type === ItemType.FILE ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-3">
            <span className="text-slate-500 text-xs uppercase tracking-wider">Preview not available</span>
            {item.mimeType?.startsWith('image/') && (
              <img src={item.content} alt={item.fileName} className="max-h-40 rounded-lg border border-white/10 shadow-lg" />
            )}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-sans leading-relaxed">{item.content}</pre>
        )}
      </div>

      {item.aiSummary && (
        <div className="mb-5 flex items-start space-x-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <p className="text-sm text-blue-200 italic leading-relaxed">{item.aiSummary}</p>
        </div>
      )}

      <div className="flex space-x-3">
        {item.type === ItemType.FILE ? (
          <a
            href={item.content}
            download={item.fileName || 'download'}
            className="flex-1 flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
          >
            Download
          </a>
        ) : (
          <button
            onClick={() => window.open(item.content, '_blank')}
            className={`flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all border ${item.type === ItemType.LINK ? 'bg-blue-600 text-white hover:bg-blue-500 border-transparent shadow-lg shadow-blue-900/20' : 'hidden'}`}
          >
            Open Link
          </button>
        )}

        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center px-4 py-2.5 border border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white text-sm font-semibold rounded-xl transition-all backdrop-blur-sm ${item.type === ItemType.LINK ? '' : 'w-full'}`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            'Copy'
          )}
        </button>
      </div>
    </div>
  );
};

export default SharedItemCard;