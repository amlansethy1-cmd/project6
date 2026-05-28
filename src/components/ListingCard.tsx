import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CheckCircle2, Eye, Star, ChevronDown, ChevronUp, MessageSquare, Flame, Sparkles } from 'lucide-react';
import { Listing, Mode } from '../types';

interface ListingCardProps {
  item: Listing;
  theme: any;
  index: number;
  activeMode: Mode;
  isDark: boolean;
  onBookClick: (listing: Listing, preselectedSlot?: string) => void;
}

export const SPRING_IOS = { type: "spring", stiffness: 400, damping: 30 } as const;
export const SPRING_BOUNCY = { type: "spring", stiffness: 500, damping: 25 } as const;

export default function ListingCard({ item, theme, index, activeMode, isDark, onBookClick }: ListingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0 }
      }}
      transition={{ 
        layout: SPRING_IOS, 
        opacity: { duration: 0.5 },
        scale: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
        y: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
      }}
      className="w-full mb-8 overflow-hidden shadow-sm relative"
      style={{
        background: theme.card,
        borderRadius: '36px',
        border: `1px solid ${theme.cardBorder || 'transparent'}`,
        boxShadow: isDark 
          ? '0 -4px 32px -16px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5)'
          : '0 10px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
      }}
      id={`listing-${item.id}`}
    >
      <div className="p-2">
        {/* Premium Image Wrapper */}
        <motion.div 
          layout="position"
          className="relative w-full h-72 rounded-[30px] overflow-hidden cursor-pointer group shadow-inner"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img 
            src={item.img} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
            referrerPolicy="no-referrer"
            style={{ filter: activeMode === 'rooms' ? 'brightness(1.02) contrast(1.02) saturate(1.05)' : 'brightness(1.1) contrast(1.1) saturate(1.2)' }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 opacity-90" />
          
          <div className="absolute inset-0 z-0" style={{
            background: `radial-gradient(ellipse at top left, ${theme.accentGlow} 0%, transparent 70%)`
          }} />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <div style={{
              background: 'rgba(52,199,89,0.15)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(52,199,89,0.3)',
              color: '#34C759',
            }} className="px-2.5 py-1 text-[10px] font-semibold rounded-full flex items-center gap-1 w-max">
              <CheckCircle2 size={10} /> Verified
            </div>

            {item.status === '🔴 LIVE TONIGHT' && activeMode === 'party' && (
              <div style={{
                background: 'rgba(239,68,68,0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#EF4444',
              }} className="px-2.5 py-1 text-[10px] font-semibold rounded-full flex items-center gap-1 w-max">
                <Flame size={10} className="animate-pulse" /> LIVE TONIGHT
              </div>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF'
            }} className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star size={10} className="fill-amber-400 text-amber-400" /> {item.rating.toFixed(1)}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <div style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} 
                 className="text-white text-[9px] font-mono font-medium flex items-center gap-1 px-2 py-1 rounded-md">
              <Eye size={10} /> {item.views} views today
            </div>
          </div>
          
          <div 
            className="absolute bottom-3 right-3 text-white text-[9px] font-bold font-mono uppercase tracking-widest px-3 py-1 rounded-full z-10"
            style={{ 
              background: theme.accentGradient,
              boxShadow: activeMode === 'party' ? '0 4px 12px rgba(245,158,11,0.2)' : 'none',
            }}
          >
            {item.tier}
          </div>
        </motion.div>
      </div>

      <div className="px-4 pb-4">
        <motion.div layout="position" className="flex justify-between items-start mb-0.5 gap-2">
          <h3 
            className="cursor-pointer hover:underline decoration-1"
            style={{ 
              color: theme.textPrimary,
              fontSize: '18px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display"',
              fontWeight: 700,
              letterSpacing: '-0.3px',
              lineHeight: 1.2
            }}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {item.title}
          </h3>
        </motion.div>

        <motion.div layout="position" className="flex items-center gap-1 mb-3.5 mt-1">
          <MapPin size={12} style={{ color: theme.textMuted }} />
          <span style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '0.1px', color: theme.textMuted }}>
            {item.location}, Odisha
          </span>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto flex items-center gap-0.5 haptic-press uppercase"
            style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', color: theme.accent, fontFamily: 'monospace' }}
          >
            Details {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SPRING_IOS}
              className="overflow-hidden mb-4 border-b pb-4 shrink-0"
              style={{ borderColor: `${theme.textMuted}22` }}
            >
              <p className="leading-relaxed mb-4" style={{ fontSize: '13px', color: theme.textMuted }}>
                {item.description}
              </p>

              {activeMode === 'party' ? (
                <div className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                      Venue Capacity
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textPrimary }}>
                      {item.capacity}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full" style={{ width: '75%', background: theme.accentGradient }} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 mb-4">
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }} className="block mb-0.5">
                      Capacity
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary }}>
                      {item.capacity}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }} className="block mb-0.5">
                      Service Tier
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textPrimary, textTransform: 'capitalize' }}>
                      {item.tier} Setup
                    </span>
                  </div>
                </div>
              )}

              {/* Tags / Amenities */}
              <div className="pt-2">
                <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.8px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }} className="block mb-2.5">
                  Highlights & Amenities
                </span>
                <div className="flex flex-wrap gap-2">
                  {item.tags?.map((tag, idx) => (
                    <span 
                      key={`tag-${idx}`} 
                      className="px-2.5 py-1.5 rounded-full flex items-center shadow-sm" 
                      style={{ 
                        fontSize: '11px', fontWeight: 700, letterSpacing: '-0.1px',
                        background: activeMode === 'party' ? 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(212,119,6,0.05) 100%)' : 'rgba(197,160,89,0.1)',
                        color: activeMode === 'party' ? '#FDE68A' : '#B48A3A',
                        border: activeMode === 'party' ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(197,160,89,0.2)' 
                      }}
                    >
                      <Sparkles size={10} className="mr-1 opacity-70" /> {tag}
                    </span>
                  ))}
                  {item.amenities.map((amenity, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1.5 rounded-full"
                      style={{ 
                        fontSize: '11px', fontWeight: 600, letterSpacing: '-0.1px',
                        background: activeMode === 'rooms' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)', 
                        color: theme.textSecondary,
                        border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout="position" className="mb-4">
          <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }} className="block mb-2">
            Select Available Slot
          </span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {item.slots.map((slot, i) => {
              const isBooked = slot.status === "Booked";
              const isSelected = selectedSlot === slot.time;
              
              return (
                <button 
                  key={i}
                  type="button"
                  disabled={isBooked}
                  onClick={() => setSelectedSlot(isSelected ? null : slot.time)}
                  className="px-3 py-2 shrink-0 haptic-press transition-all duration-200"
                  style={isBooked ? {
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '10px',
                    opacity: 0.35,
                    textDecoration: 'line-through',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '-0.1px',
                    color: theme.textPrimary
                  } : isSelected ? {
                    background: theme.accentGradient,
                    border: 'none',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    boxShadow: activeMode === 'party' ? '0 4px 12px rgba(245,158,11,0.3)' : '0 2px 8px rgba(197,160,89,0.3)',
                    fontSize: '11px', fontWeight: 600, letterSpacing: '-0.1px'
                  } : {
                    background: activeMode === 'rooms' ? 'rgba(197,160,89,0.08)' : 'rgba(245,158,11,0.08)',
                    border: `1px solid ${theme.accent}33`,
                    borderRadius: '10px',
                    color: theme.textSecondary,
                    fontSize: '11px', fontWeight: 600, letterSpacing: '-0.1px'
                  }}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Action Footer */}
        <motion.div layout="position" className="flex items-center justify-between border-t pt-4" style={{ borderColor: `${theme.textMuted}22` }}>
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px', color: theme.textMuted, textTransform: 'uppercase', fontFamily: 'monospace' }}>
                {item.mode === 'rooms' ? 'Hourly Base' : 'Slot Fee'}
              </span>
              {(item.status === '🔴 LIVE TONIGHT' || item.rating > 4.8) && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: '9px', fontWeight: 800, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                  <Flame size={8} className={item.status === '🔴 LIVE TONIGHT' ? 'animate-pulse' : ''} /> High Demand
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <p style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.8px', color: theme.textPrimary, lineHeight: 1 }}>
                {item.price}
              </p>
              {item.originalPrice && (
                <p style={{ fontSize: '13px', fontWeight: 600, color: theme.textMuted, textDecoration: 'line-through', opacity: 0.7 }}>
                  {item.originalPrice}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <motion.a
              href="https://wa.me/1234567890" // Placeholder
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-[46px] h-[46px] rounded-[16px] shadow-sm cursor-pointer relative haptic-press"
              style={{ backgroundColor: 'rgba(37,211,102,0.1)', color: '#25D366', border: '1px solid rgba(37,211,102,0.2)' }}
            >
              <MessageSquare size={18} className="fill-current" />
            </motion.a>

            <motion.button
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={() => onBookClick(item, selectedSlot || undefined)}
              style={{
                background: theme.accentGradient,
                borderRadius: '16px',
                padding: '0 24px',
                height: '46px',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                letterSpacing: '-0.2px',
                boxShadow: activeMode === 'party'
                  ? '0 4px 12px rgba(245,158,11,0.2)'
                  : '0 4px 12px rgba(197,160,89,0.2), 0 1px 0 rgba(255,255,255,0.3) inset',
              }}
              className="flex items-center gap-1.5 focus:outline-none shadow-lg"
            >
              Reserve {selectedSlot && 'Slot'}
              <motion.span variants={{ hover: { x: 3 }, tap: { x: 5 } }}>→</motion.span>
            </motion.button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
