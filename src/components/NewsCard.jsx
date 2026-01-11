import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const getCategoryColor = (cat) => {
  switch(cat?.toUpperCase()) {
    case 'POLITICS': return 'bg-pink-600 shadow-[0_0_10px_#db2777]';
    case 'SPORTS': return 'bg-purple-600 shadow-[0_0_10px_#9333ea]';
    case 'TECH': return 'bg-blue-600 shadow-[0_0_10px_#2563eb]';
    case 'BUSINESS': return 'bg-teal-500 shadow-[0_0_10px_#14b8a6]';
    case 'INDIA': return 'bg-orange-500 shadow-[0_0_10px_#f97316]';
    default: return 'bg-secondary shadow-[0_0_10px_#7000FF]';
  }
};

const NewsCard = ({ data, variant = "standard", onClick }) => {
  const isHero = variant === "hero";

  return (
    <article 
      onClick={() => onClick && onClick(data)} 
      className={twMerge(
        "group relative overflow-hidden rounded-xl bg-card-bg border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-secondary hover:shadow-neon-purple cursor-pointer",
        isHero ? "h-[450px] flex flex-col" : "h-full flex flex-col sm:flex-row sm:h-[180px]"
      )}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Image Section */}
      <div className={clsx("relative overflow-hidden", isHero ? "h-3/5 w-full" : "h-48 sm:h-full sm:w-2/5")}>
        <img 
          src={data.img_url} 
          alt={data.title}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent opacity-90" />
      </div>

      {/* Content Section */}
      <div className={clsx("relative z-10 flex flex-col justify-between p-4", isHero ? "h-2/5" : "h-full sm:w-3/5")}>
        
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold text-white mb-3 tracking-wider ${getCategoryColor(data.category)}`}>
            {data.category}
          </span>

          <h3 className={clsx("font-bold text-text-main leading-tight mb-2 group-hover:text-primary transition-colors", isHero ? "text-xl" : "text-lg")}>
            {data.title}
          </h3>

          {!isHero && (
            <p className="text-text-muted text-xs line-clamp-2 mb-3 hidden sm:block">
              {data.summary}
            </p>
          )}
        </div>

        {/* Footer / Stats - HIDDEN FOR HERO variant */}
        {!isHero && (
          <div className="flex items-center gap-4 text-text-muted text-xs font-mono border-t border-white/10 pt-3 mt-auto">
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-secondary" />
              <span>{data.views}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageCircle size={14} className="text-alert" />
              <span>{data.comments}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default NewsCard;