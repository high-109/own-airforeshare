import React, { useEffect, useState, useCallback } from 'react';
import InputArea from '../components/InputArea';
import SharedItemCard from '../components/SharedItemCard';
import { getItems, getNetworkStatus, clearAll } from '../services/mockNetworkService';
import { SharedItem, NetworkStatus } from '../types';

const Home: React.FC = () => {
  const [items, setItems] = useState<SharedItem[]>([]);
  const [network, setNetwork] = useState<NetworkStatus | null>(null);

  const refreshData = useCallback(() => {
    setItems(getItems());
    setNetwork(getNetworkStatus());
  }, []);

  useEffect(() => {
    refreshData();

    // Listen for updates from other tabs (simulating network)
    window.addEventListener('storage', refreshData);

    // Polling to update expiration timers and mock network activity
    const interval = setInterval(refreshData, 10000);

    return () => {
      window.removeEventListener('storage', refreshData);
      clearInterval(interval);
    };
  }, [refreshData]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
      {/* Network Status Header */}
      <div className="flex flex-col items-center mb-12 space-y-3 animate-fade-in">
        <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-200 text-sm font-medium shadow-lg shadow-black/10">
          <span className="relative flex h-3 w-3 mr-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Connected to <span className="text-white ml-1 font-semibold">{network?.networkId}</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">
          {network?.deviceCount} device{network?.deviceCount !== 1 ? 's' : ''} active nearby
        </p>
      </div>

      <InputArea onUpload={refreshData} />

      {/* Shared Items List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Shared Content</h2>
          {items.length > 0 && (
            <button
              onClick={() => { clearAll(); refreshData(); }}
              className="text-sm text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-white/10 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-white/5 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-float shadow-inner border border-white/5">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">Share text, links, or files to see them appear here instantly for everyone on the network.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <SharedItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;