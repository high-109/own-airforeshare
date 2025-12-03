import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-8 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Sharing
      </Link>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-6">How It Works & Privacy</h1>
      
      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm font-bold">1</span>
            Same Wi-Fi Detection
          </h2>
          <p>
            WiFiDrop works by grouping users on the same public IP address or local network. 
            When you open the site, we assign you to a temporary "room" based on your connection.
            Anyone else on your Wi-Fi will see what you post immediately.
          </p>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3 text-sm font-bold">2</span>
            Temporary Storage
          </h2>
          <p>
            Nothing is saved permanently. Every text, link, or file you upload is automatically deleted 
            after 30 minutes. We do not require accounts, and we do not track your history. 
            Once the timer hits zero, the data is wiped from our memory.
          </p>
        </section>

        <section className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900 mb-3 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center mr-3 text-sm font-bold">3</span>
            No Cloud Persistence
          </h2>
          <p>
            Your files are held in temporary memory (RAM) or short-term ephemeral storage buckets.
            We prioritize speed and privacy over long-term hosting. 
            This is a digital "drop zone", not a cloud drive.
          </p>
        </section>

        <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 border border-slate-200">
           <strong>Note:</strong> This version is running in a demo environment. 
           It uses your browser's local storage to simulate the network experience so you can test it alone.
           In a production deployment, this would use a WebSocket server to sync devices.
        </div>
      </div>
    </div>
  );
};

export default Privacy;