import React from 'react';
import { Home } from 'lucide-react';
import { clsx } from 'clsx';
import logoImg from '/logo.png'; 

const categories = ["POLITICS", "SPORTS", "BUSINESS", "INDIA", "WORLD", "TECH"];

const Navbar = ({ activeCategory, onCategorySelect }) => {
  return (
    // Added animate-enter-card for entry
    <header className="sticky top-0 z-50 bg-bg-dark/90 backdrop-blur-lg border-b border-white/5 shadow-subtle-depth animate-enter-card">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Row */}
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="relative group cursor-pointer"
              onClick={() => onCategorySelect("ALL")} 
            >
              {/* Added subtle hover float and drop shadow feedback */}
              <img 
                src={logoImg} 
                alt="Brainrot Newzz" 
                className="h-12 md:h-16 w-auto object-contain transition-all duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_4px_6px_rgba(112,0,255,0.2)]"
              />
            </div>
          </div>
          
          <div className="text-text-muted/60 font-mono text-xs tracking-widest hidden sm:block">
            {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 py-3 overflow-x-auto no-scrollbar mask-image-linear-gradient-to-r">
          <button 
            onClick={() => onCategorySelect("ALL")}
            // Subtler active state and hover move
            className={clsx(
              "transition-all duration-300 hover:-translate-y-0.5",
              activeCategory === "ALL" ? "text-primary drop-shadow-[0_0_5px_rgba(250,255,0,0.3)]" : "text-text-muted hover:text-white"
            )}
          >
            <Home size={20} />
          </button>
          
          {categories.map((cat, idx) => (
            <button 
              key={cat}
              onClick={() => onCategorySelect(cat)}
              // Staggered entry for nav items
              style={{ animationDelay: `${idx * 50 + 200}ms` }}
              className={clsx(
                "text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-300 hover:-translate-y-0.5 animate-enter-card backwards",
                activeCategory === cat 
                  // Subtler active indicator
                  ? "text-white border-b-2 border-primary/70" 
                  : "text-text-muted/70 hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;