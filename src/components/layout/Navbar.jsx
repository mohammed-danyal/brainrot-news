import React from 'react';

const navLinks = ['Politics', 'Sports', 'Business', 'India', 'World', 'Tech'];

export const Navbar = () => {
  return (
    <nav className="border-b border-card-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          {/* Placeholder for the logo from image */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent animate-pulse" />
          <h1 className="text-xl font-bold tracking-tighter text-white">
            BRAINROT-<span className="text-accent">NEWZZ</span>
          </h1>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <a 
              key={link} 
              href={`#${link}`}
              className="text-text-muted hover:text-primary font-medium text-sm uppercase tracking-wide transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Date Display */}
        <div className="text-text-main text-sm font-mono">
          {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </nav>
  );
};