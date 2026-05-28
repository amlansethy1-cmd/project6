import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquareCode, Heart, Send } from 'lucide-react';
import { Review, Listing, Mode } from '../types';

interface ReviewsProps {
  reviews: Review[];
  listings: Listing[];
  theme: any;
  activeMode: Mode;
  isDark: boolean;
  onAddReview: (review: { author: string; text: string; rating: number; listingId: number }) => void;
}

export const SPRING_IOS = { type: "spring", stiffness: 400, damping: 30 } as const;

export default function Reviews({ reviews, listings, theme, activeMode, isDark, onAddReview }: ReviewsProps) {
  const [authorName, setAuthorName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [targetVenue, setTargetVenue] = useState(listings[0]?.id || 1);
  const [errorBanner, setErrorBanner] = useState('');
  const [reviewCount, setReviewCount] = useState<Record<string, number>>({});

  const handleLike = (id: string) => {
    setReviewCount(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner('');
    if (!authorName.trim()) return setErrorBanner('Please provide your name');
    if (!reviewText.trim()) return setErrorBanner('Please write some review feedback');
    onAddReview({ author: authorName.trim(), text: reviewText.trim(), rating, listingId: Number(targetVenue) });
    setAuthorName(''); setReviewText(''); setRating(5);
  };

  return (
    <div className="w-full h-full pb-16">
      <div className="flex justify-between items-center mb-5 mt-2 px-1">
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif' }}>
            Community
          </h2>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textMuted }}>Authentic local testimonials</p>
        </div>
        <MessageSquareCode size={24} style={{ color: theme.accent }} />
      </div>

      <div className={`rounded-[28px] p-5 mb-8 flex flex-col gap-4 shadow-sm`} style={{ background: theme.card, border: `1px solid ${theme.cardBorder || 'transparent'}` }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px', color: theme.textPrimary, textTransform: 'uppercase', textAlign: 'center' }}>Leave Feedback</h3>
        {errorBanner && <div className="p-2.5 rounded-[12px] flex items-center justify-center text-[11px] font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">⚠ {errorBanner}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Your Name</label>
              <input type="text" placeholder="E.g. Jaydev" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full px-3.5 py-3 focus:outline-none transition-all ios-input" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, borderRadius: '14px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, fontSize: '13px', fontWeight: 500 }} />
            </div>
            <div>
              <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Target Venue</label>
              <select value={targetVenue} onChange={(e) => setTargetVenue(Number(e.target.value))} className="w-full px-3 py-3 focus:outline-none transition-all ios-input appearance-none truncate" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, borderRadius: '14px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, fontSize: '12px', fontWeight: 500 }}>
                {listings.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Rating Base</label>
            <div className="flex gap-2 items-center p-2 rounded-[14px]" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
              {[1, 2, 3, 4, 5].map(i => (
                <motion.button type="button" key={i} whileTap={{ scale: 0.8 }} onClick={() => setRating(i)} className="p-1.5 flex items-center justify-center">
                  <Star size={20} className={i <= rating ? "fill-amber-400 text-amber-400" : (activeMode === 'rooms' ? "text-black/10" : "text-white/10")} />
                </motion.button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Your Feedback</label>
            <textarea rows={3} placeholder="How was the hygiene, state presence, stage layout?" value={reviewText} onChange={(e) => setReviewText(e.target.value)} className="w-full px-3.5 py-3 focus:outline-none resize-none ios-input" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, borderRadius: '14px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, fontSize: '13px', fontWeight: 500, lineHeight: 1.5 }} />
          </div>
          <motion.button type="submit" whileTap={{ scale: 0.96 }} transition={SPRING_IOS} className="w-full mt-2 py-4 rounded-[16px] font-bold text-[13px] text-white shadow-lg haptic-press flex justify-center items-center gap-2" style={{ background: theme.accentGradient }}>
            Submit Testimonial <Send size={14} />
          </motion.button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {reviews.map((rev, idx) => {
            const corrList = listings.find(l => l.id === rev.listingId);
            const lk = reviewCount[rev.id] || 0;
            return (
              <motion.div key={rev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ ...SPRING_IOS, delay: Math.min(idx * 0.05, 0.3) }} className={`p-4 rounded-[24px] shadow-sm`} style={{ background: theme.card, border: `1px solid ${theme.cardBorder || 'transparent'}` }}>
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <img src={rev.avatar} alt={rev.author} className="w-10 h-10 rounded-full object-cover shadow-sm border" style={{ borderColor: activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)' }} referrerPolicy="no-referrer" />
                    <div className="absolute -bottom-1 -right-1 bg-amber-400 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center shadow-sm">
                      <Star size={7} className="fill-current mr-0.5" />{rev.rating}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-0.2px' }} className="truncate w-[140px]">{rev.author}</h4>
                      <span style={{ fontSize: '9px', fontWeight: 600, color: theme.textMuted }}>{rev.date}</span>
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.accent }} className="block mb-2 truncate max-w-full">at {corrList?.title || "Venue"}</span>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, color: activeMode === 'rooms' ? '#3D3428' : '#D4C8A8', fontWeight: 500 }} className="mb-3">
                      "{rev.text}"
                    </p>
                    <div className="flex items-center gap-2">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => handleLike(rev.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full haptic-press" style={{ background: (rev.likes + lk) > 0 ? theme.accentGradient : (activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'), color: (rev.likes + lk) > 0 ? '#FFFFFF' : theme.textPrimary, boxShadow: (rev.likes + lk) > 0 ? (activeMode === 'party' ? '0 4px 12px rgba(245,158,11,0.2)' : '0 2px 8px rgba(197,160,89,0.2)') : 'none' }}>
                        <Heart size={12} className={(rev.likes + lk) > 0 ? "fill-current" : ""} />
                         <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'monospace' }}>{(rev.likes + lk) > 0 ? rev.likes + lk : 'Like'}</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
