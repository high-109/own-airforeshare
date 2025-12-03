import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-sans selection:bg-blue-500/30">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300 border border-white/20">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 group-hover:to-white transition-all">WiFiDrop</span>
          </Link>
          
          <nav className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <Link 
              to="/" 
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/') 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Share
            </Link>
            <Link 
              to="/privacy" 
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/privacy') 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              How it works
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col pt-24 pb-12 relative z-10">
        {children}
      </main>

      <footer className="py-8 mt-auto border-t border-white/5 bg-slate-900/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} WiFiDrop. Local. Instant. Private.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <Link to="/privacy" className="hover:text-white transition-colors duration-200">Privacy</Link>
             <Link to="/privacy" className="hover:text-white transition-colors duration-200">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;