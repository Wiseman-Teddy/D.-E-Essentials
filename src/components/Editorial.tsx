import React, { useState } from "react";
import { BookOpen, Search, Heart, User, Calendar, Tag, ArrowRight, X } from "lucide-react";
import { BlogPost } from "../types";
import { BLOG_POSTS } from "../data";

export default function Editorial() {
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Handle blog likes toggle
  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const filteredPosts = posts.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="editorial-root">
      
      {/* Page Title Editorial */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-burgundy px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <BookOpen size={14} className="text-brand-gold" />
          <span>The Perfume Chronicle</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-brand-burgundy leading-tight">
          THE D&E <span className="font-serif italic font-extrabold text-brand-gold">MAGAZINE</span>
        </h1>
        <p className="font-sans text-xs text-brand-burgundy/70 mt-3 leading-relaxed">
          Delve into expert olfactory critiques, historic scent retrospectives, and deep composition breakdowns curated by master perfumers.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mt-6">
          <input
            type="text"
            placeholder="Search chronicles, guides, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-3 pl-10 pr-4 bg-white border border-brand-gold/25 rounded-xl focus:outline-none focus:border-brand-burgundy transition"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-brand-burgundy/40" />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={40} className="text-brand-gold/30 mx-auto" />
          <p className="font-serif text-base font-bold text-brand-burgundy mt-4">Chronicle Not Found</p>
          <p className="text-xs text-brand-burgundy/60 mt-1">Try searching for other keywords like 'layering' or 'sandalwood'.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Main Featured Article Banner */}
          {featuredPost && (
            <div
              onClick={() => setSelectedPost(featuredPost)}
              className="group relative bg-white border border-brand-gold/15 rounded-3xl overflow-hidden hover:border-brand-gold/35 cursor-pointer shadow-sm transition-all duration-300 flex flex-col lg:flex-row min-h-[400px]"
            >
              <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative">
                <img referrerPolicy="no-referrer" src={featuredPost.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <span className="absolute top-4 left-4 bg-brand-burgundy text-brand-gold text-[8px] font-extrabold uppercase tracking-widest px-3 py-1 rounded border border-brand-gold/30 z-10">
                  Featured Article
                </span>
              </div>
              <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] text-brand-gold-dark font-extrabold uppercase tracking-widest">
                    <span>{featuredPost.category}</span>
                    <span>•</span>
                    <span className="flex items-center"><Calendar size={10} className="mr-1" /> {featuredPost.date}</span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-brand-burgundy leading-snug group-hover:text-brand-gold transition">
                    {featuredPost.title}
                  </h2>
                  <p className="text-xs text-brand-burgundy/75 leading-relaxed font-light">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-brand-gold/10 pt-6 mt-6">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-brand-cream-dark flex items-center justify-center font-bold text-brand-burgundy text-[9px]">
                      {featuredPost.author[0]}
                    </div>
                    <span className="font-medium text-brand-burgundy/80">{featuredPost.author}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => handleLikePost(featuredPost.id, e)}
                      className="flex items-center space-x-1.5 text-[10px] font-bold text-red-700 hover:scale-105 transition"
                    >
                      <Heart size={14} className="fill-red-100" />
                      <span>{featuredPost.likes}</span>
                    </button>
                    <span className="text-xs font-bold text-brand-burgundy flex items-center space-x-1 uppercase tracking-wider">
                      <span>Read Chronicle</span>
                      <ArrowRight size={14} className="transform group-hover:translate-x-1 transition" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Articles */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {gridPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group bg-white border border-brand-gold/10 rounded-2xl overflow-hidden hover:border-brand-gold/30 transition shadow-sm cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-video overflow-hidden">
                    <img referrerPolicy="no-referrer" src={post.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center space-x-2 text-[9px] text-brand-gold-dark font-extrabold uppercase tracking-widest">
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      <h3 className="font-serif text-base font-bold text-brand-burgundy leading-snug group-hover:text-brand-gold transition">
                        {post.title}
                      </h3>
                      <p className="text-xs text-brand-burgundy/70 line-clamp-2 leading-relaxed font-light">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-brand-gold/10 pt-4 mt-4 text-xs">
                      <span className="font-medium text-brand-burgundy/60">By {post.author.split(",")[0]}</span>
                      <button
                        onClick={(e) => handleLikePost(post.id, e)}
                        className="flex items-center space-x-1 text-[10px] font-bold text-red-700 hover:scale-105 transition"
                      >
                        <Heart size={12} />
                        <span>{post.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editorial detailed overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" id="editorial-detail-modal">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setSelectedPost(null)} />
          <div className="relative bg-brand-cream border border-brand-gold/30 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-zoom-in z-10 flex flex-col max-h-[90vh]">
            
            {/* Modal Header Cover */}
            <div className="relative h-48 sm:h-64 flex-shrink-0">
              <img referrerPolicy="no-referrer" src={selectedPost.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-transparent" />
              <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 p-2.5 bg-black/40 text-white rounded-full hover:bg-black/60 transition font-bold">✕</button>
            </div>

            {/* Modal Body Contents */}
            <div className="p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="flex items-center space-x-3 text-[10px] text-brand-gold-dark font-extrabold uppercase tracking-widest">
                <span>{selectedPost.category}</span>
                <span>•</span>
                <span>Published {selectedPost.date}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-burgundy leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center space-x-2 text-xs text-brand-burgundy border-b border-brand-gold/10 pb-4">
                <div className="w-8 h-8 rounded-full bg-brand-burgundy text-brand-gold flex items-center justify-center font-bold text-xs">{selectedPost.author[0]}</div>
                <div>
                  <p className="font-bold">{selectedPost.author}</p>
                  <p className="text-[10px] text-brand-burgundy/60 font-medium">Controlling Editor</p>
                </div>
              </div>

              {/* Chronicle Prose */}
              <div className="text-xs sm:text-sm text-brand-burgundy/90 leading-relaxed font-light space-y-4 whitespace-pre-line prose max-w-none">
                {selectedPost.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 border-t border-brand-gold/10 pt-6">
                {selectedPost.tags.map((t) => (
                  <span key={t} className="flex items-center text-[9px] font-bold uppercase tracking-widest text-brand-burgundy px-2.5 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/15">
                    <Tag size={8} className="mr-1 text-brand-gold" />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
