import React, { useEffect, useState, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import ArticleView from './components/ArticleView';
import { fetchNewsData } from './utils/dataService';

const PAGE_SIZE = 4;

function App() {
  // Data State
  const [allNews, setAllNews] = useState([]);
  
  // View State
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [filteredNews, setFilteredNews] = useState([]);
  
  // Display State
  const [trending, setTrending] = useState([]);
  const [feed, setFeed] = useState([]); 
  const [nextIndex, setNextIndex] = useState(0); 
  
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const observerRef = useRef();

  // 1. Initial Data Fetch
  useEffect(() => {
    const init = async () => {
      const data = await fetchNewsData();
      if (data.length > 0) {
        setAllNews(data);
        // Initial setup for "ALL"
        updateView(data, "ALL");
      }
      setLoading(false);
    };
    init();
  }, []);

  // Helper: Resets the view when data or category changes
  const updateView = (data, category) => {
    let relevantData = data;

    if (category !== "ALL") {
      relevantData = data.filter(item => 
        item.category.toUpperCase() === category.toUpperCase()
      );
    }

    setFilteredNews(relevantData);

    // Re-split for Trending vs Feed
    // If we have very few items after filtering, logic adapts
    const topStories = relevantData.slice(0, 3);
    const remaining = relevantData.slice(3);
    
    setTrending(topStories);
    
    // Reset Scroll Pagination
    const firstBatch = remaining.slice(0, PAGE_SIZE);
    setFeed(firstBatch);
    setNextIndex(3 + PAGE_SIZE);
    setHasMore(remaining.length > PAGE_SIZE);
  };

  // 2. Handle Category Click
  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    // Reset scroll position to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateView(allNews, category);
  };

  // 3. Scroll Loading Logic
  const loadMore = useCallback(() => {
    if (nextIndex >= filteredNews.length) {
      setHasMore(false);
      return;
    }
    const newBatch = filteredNews.slice(nextIndex, nextIndex + PAGE_SIZE);
    setFeed(prev => [...prev, ...newBatch]);
    setNextIndex(prev => prev + PAGE_SIZE);
  }, [nextIndex, filteredNews]);

  // 4. Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMore();
      }
    }, { threshold: 1.0 });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-secondary selection:text-white">
      <Navbar 
        activeCategory={activeCategory} 
        onCategorySelect={handleCategorySelect} 
      />
      
      {selectedArticle && (
        <ArticleView 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        
        {/* SECTION 1: TRENDING NEWS (Top 3 of current category) */}
        {trending.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {activeCategory === "ALL" ? "Trending News" : `Top ${activeCategory} News`}
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-secondary/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trending.map(item => (
                <NewsCard 
                  key={item.id} 
                  data={item} 
                  variant="hero" 
                  onClick={() => setSelectedArticle(item)}
                />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: LATEST UPDATES (Scrollable) */}
        {feed.length > 0 ? (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Latest Updates
              </h2>
              <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {feed.map(item => (
                <NewsCard 
                  key={item.id} 
                  data={item} 
                  variant="standard" 
                  onClick={() => setSelectedArticle(item)}
                />
              ))}
            </div>

            {hasMore && (
              <div ref={observerRef} className="py-10 flex justify-center w-full">
                <div className="flex items-center gap-2 text-secondary animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-primary"></div>
                   <div className="w-2 h-2 rounded-full bg-secondary"></div>
                   <div className="w-2 h-2 rounded-full bg-alert"></div>
                   <span className="text-sm font-mono tracking-widest ml-2">LOADING...</span>
                </div>
              </div>
            )}
            
            {!hasMore && (
              <div className="text-center py-10 text-text-muted font-mono text-sm border-t border-white/5 mt-10">
                /// END OF TRANSMISSION ///
              </div>
            )}
          </section>
        ) : (
          /* Empty State if category has no news */
          !loading && (
            <div className="text-center py-20 opacity-50">
              <p className="text-xl font-mono text-primary">NO TRANSMISSIONS FOUND</p>
              <p className="text-sm text-text-muted">Try selecting a different frequency.</p>
            </div>
          )
        )}

      </main>
    </div>
  );
}

export default App;