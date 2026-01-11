import React, { memo } from 'react';
import { Badge } from '../ui/Badge';
import { Clock } from 'lucide-react'; // Assuming lucide-react for icons

const NewsCard = ({ news, variant = 'standard' }) => {
  const isFeatured = variant === 'featured';

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-card-bg border border-card-border transition-all duration-300 hover:border-secondary hover:shadow-neon-blue flex flex-col ${isFeatured ? 'h-full' : 'h-auto'}`}>
      
      {/* Image Container */}
      <div className={`relative overflow-hidden ${isFeatured ? 'h-48 md:h-64' : 'h-40'}`}>
        <img 
          src={news.img_url} 
          alt={news.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge category={news.category} />
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className={`font-bold text-text-main leading-tight mb-2 group-hover:text-primary transition-colors ${isFeatured ? 'text-xl' : 'text-lg'}`}>
            {news.title}
          </h3>
          {/* Only show summary on featured cards to match layout */}
          {isFeatured && (
            <p className="text-text-muted text-sm line-clamp-2 mb-4">
              {news.summary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted mt-2">
          <div className="flex items-center gap-1">
             <Clock size={12} />
             <span>{news.date} • {news.time}</span>
          </div>
          <button className="text-accent font-semibold hover:text-white transition-colors">
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(NewsCard);