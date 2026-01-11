import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, MessageCircle } from 'lucide-react';

const ArticleView = ({ article, onClose }) => {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center bg-bg/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-bg-dark w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-secondary/30 shadow-[0_0_50px_rgba(112,0,255,0.2)] relative flex flex-col">
        
        {/* Close Button (Sticky) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:text-primary hover:rotate-90 transition-all duration-300 border border-white/10"
        >
          <X size={24} />
        </button>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 w-full shrink-0">
          <img 
            src={article.img_url} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent" />
          
          {/* Badge over image */}
          <div className="absolute bottom-6 left-6 md:left-10">
            <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest shadow-[0_0_15px_rgba(112,0,255,0.5)]">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-4 border-b border-white/10 pb-6">
            <h1 className="text-3xl md:text-5xl font-bold text-text-main leading-tight font-display">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-text-muted text-sm font-mono">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                {article.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                {article.time}
              </div>
               <div className="flex items-center gap-2 ml-auto">
                <Share2 size={16} className="hover:text-white cursor-pointer" />
                <MessageCircle size={16} className="hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Actual Article Text */}
          <div className="prose prose-invert max-w-none">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light">
              {article.summary}
            </p>
            
            {/* Simulated Extra Content for "Realism" since Sheet only has summary */}
            <p className="text-text-muted leading-relaxed mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            </p>
            <p className="text-text-muted leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-8 mt-8 border-t border-white/10 flex justify-center">
             <button 
                onClick={onClose}
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold tracking-widest hover:bg-white/10 hover:scale-105 transition-all"
             >
               BACK TO FEED
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleView;