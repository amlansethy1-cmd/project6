import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Phone, Users, ShieldCheck, TicketCheck, ArrowRight, QrCode } from 'lucide-react';
import { Listing, Booking, Mode } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  listing: Listing | null;
  preselectedSlot?: string;
  theme: any;
  activeMode: Mode;
  isDark: boolean;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const SPRING_IOS = { type: "spring", stiffness: 400, damping: 30 } as const;

export default function BookingModal({ isOpen, listing, preselectedSlot, theme, activeMode, isDark, onClose, onSuccess }: BookingModalProps) {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (listing) {
      setStep('form');
      setErrorMsg('');
      setIsSubmitting(false);
      if (preselectedSlot) {
        setSelectedSlot(preselectedSlot);
      } else {
        const firstAvail = listing.slots.find(s => s.status === 'Available');
        setSelectedSlot(firstAvail ? firstAvail.time : '');
      }
      setGuestsCount(listing.mode === 'rooms' ? 2 : 100);
      setCustomerName('');
      setCustomerPhone('');
    }
  }, [listing, preselectedSlot, isOpen]);

  if (!isOpen || !listing) return null;

  const basePrice = listing.priceNum;
  const taxAmount = Math.round(basePrice * 0.18);
  const serviceFee = 150;
  const totalAmount = basePrice + taxAmount + serviceFee;

  const handleGuestsIncrement = () => {
    const max = listing.mode === 'rooms' ? 6 : 1500;
    if (guestsCount < max) setGuestsCount(prev => prev + (listing.mode === 'rooms' ? 1 : 25));
  };
  const handleGuestsDecrement = () => {
    const min = listing.mode === 'rooms' ? 1 : 10;
    if (guestsCount > min) setGuestsCount(prev => prev - (listing.mode === 'rooms' ? 1 : 25));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!customerName.trim()) return setErrorMsg('Please enter your full name');
    if (!customerPhone.trim() || customerPhone.trim().length < 10) return setErrorMsg('Please enter a valid 10-digit mobile number');
    if (!selectedSlot) return setErrorMsg('Please select a valid booking slot');

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedBookingId = `OKB-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: Booking = {
        id: generatedBookingId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingImg: listing.img,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        date: bookingDate,
        selectedSlot: selectedSlot,
        guestsCount: guestsCount,
        totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        status: 'confirmed',
        tier: listing.tier
      };
      setActiveBooking(newBooking);
      setStep('success');
      onSuccess(newBooking);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex justify-center pb-safe overflow-hidden ${isDesktop ? 'items-center p-4' : 'items-end'}`}>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step === 'form' ? onClose : undefined}
        className="absolute inset-0 z-0"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      />

      <motion.div
        layout
        initial={isDesktop ? { opacity: 0, scale: 0.96, y: 10 } : { y: "100%" }}
        animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
        exit={isDesktop ? { opacity: 0, scale: 0.96, y: 10 } : { y: "100%" }}
        transition={{ ...SPRING_IOS, damping: 28 }}
        className={`relative w-full max-h-[92vh] overflow-y-auto no-scrollbar pointer-events-auto z-10 ${isDesktop ? 'max-w-lg rounded-3xl p-6' : 'max-w-md rounded-t-[36px] p-6'}`}
        style={{
          background: theme.card,
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          boxShadow: isDark 
            ? '0 -10px 40px rgba(0,0,0,0.4), 0 -8px 24px rgba(245,158,11,0.08)' 
            : '0 -10px 40px rgba(0,0,0,0.1)',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.8)'}`,
        }}
      >
        {!isDesktop && <div className="w-12 h-1.5 rounded-full mx-auto mb-6" style={{ background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' }} />}

        <motion.div layout="position" className="flex justify-between items-center mb-5">
          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif' }}>
            {step === 'form' ? 'Reserve Slot' : 'Pass Confirmed'}
          </h2>
          {step === 'form' && (
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center haptic-press"
              style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)', color: theme.textPrimary }}
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form 
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4 pb-2"
            >
              <div className="flex gap-4 p-4 rounded-[24px] mb-2 shadow-sm relative overflow-hidden" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.03)', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
                {/* Image Reflection / Glow Effect */}
                <div className="absolute top-4 left-4 w-16 h-16 rounded-[16px] blur-xl opacity-40 scale-110 z-0 pointer-events-none" style={{ backgroundImage: `url(${listing.img})`, backgroundSize: 'cover' }} />
                
                <img src={listing.img} alt={listing.title} className="w-16 h-16 rounded-[16px] object-cover relative z-10 shadow-md" />
                <div className="flex flex-col justify-center relative z-10">
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, lineHeight: 1.2, letterSpacing: '-0.2px' }}>{listing.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: theme.accent, backgroundColor: `${theme.accent}15`, padding: '2px 8px', borderRadius: '6px' }}>{listing.tier} setup</span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: theme.textMuted }}>{listing.mode === 'rooms' ? 'Hourly Stay' : 'Venue'}</span>
                  </div>
                </div>
              </div>

              {errorMsg && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3.5 rounded-[16px] flex items-center gap-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                  <ShieldCheck size={16} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{errorMsg}</span>
                </motion.div>
              )}

              <div>
                <label className="block mb-2 ml-1" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase', color: theme.textMuted }}>Reserved Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-current" style={{ color: theme.textMuted }} />
                  <input type="text" placeholder="E.g. Jaydev Patnaik" value={customerName} onChange={(e) => setCustomerName(e.target.value)} 
                    className="w-full pl-[42px] pr-4 py-4 focus:outline-none transition-all shadow-inner"
                    style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', color: theme.textPrimary, borderRadius: '18px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`, fontSize: '14px', fontWeight: 600 }}
                  />
                  <div className="absolute inset-0 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `0 0 0 2px ${theme.accent}40` }} />
                </div>
              </div>

              <div>
                <label className="block mb-2 ml-1" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.6px', textTransform: 'uppercase', color: theme.textMuted }}>WhatsApp / Phone Number</label>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-current" style={{ color: theme.textMuted }} />
                  <input type="tel" maxLength={10} placeholder="10-digit mobile number" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))} 
                    className="w-full pl-[42px] pr-4 py-4 focus:outline-none transition-all shadow-inner"
                    style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)', color: theme.textPrimary, borderRadius: '18px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`, fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}
                  />
                  <div className="absolute inset-0 rounded-[18px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ boxShadow: `0 0 0 2px ${theme.accent}40` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Target Date</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.textMuted }} />
                    <input type="date" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} 
                      className="w-full pl-[32px] pr-2 py-3.5 focus:outline-none transition-all ios-input"
                      style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, borderRadius: '14px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, fontSize: '13px', fontWeight: 500 }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>Session Slot</label>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {listing.slots.map((s, i) => {
                      const isBooked = s.status === 'Booked';
                      const isSelected = selectedSlot === s.time;
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(s.time)}
                          className="shrink-0 px-3.5 py-2.5 rounded-[12px] font-semibold haptic-press transition-all flex flex-col items-center justify-center min-w-[70px]"
                          style={{
                            background: isBooked ? 'rgba(0,0,0,0.05)' : isSelected ? theme.accentGradient : (activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'),
                            border: `1px solid ${isSelected ? 'transparent' : (activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')}`,
                              color: isSelected ? '#FFFFFF' : (isBooked ? theme.textMuted : theme.textPrimary),
                              opacity: isBooked ? 0.4 : 1,
                              boxShadow: isSelected ? (activeMode === 'party' ? '0 0 12px rgba(245,158,11,0.2)' : '0 2px 8px rgba(197,160,89,0.2)') : 'none'
                            }}
                          >
                          <span style={{ fontSize: '12px' }}>{s.time.split(' ')[0]}</span>
                          <span style={{ fontSize: '10px', opacity: 0.8 }}>{s.time.split(' ')[1] || ''}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1.5" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted }}>{listing.mode === 'rooms' ? 'Guest Capacity' : 'Expected Guests'}</label>
                <div className="flex items-center justify-between p-1.5 rounded-[14px]" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
                  <button type="button" onClick={handleGuestsDecrement} className="w-10 h-10 flex items-center justify-center rounded-[10px] haptic-press" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)', color: theme.textPrimary, fontSize: '16px', fontWeight: 600 }}>-</button>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: theme.textPrimary, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> {guestsCount} {listing.mode === 'rooms' ? 'Persons' : 'Guests'}
                  </span>
                  <button type="button" onClick={handleGuestsIncrement} className="w-10 h-10 flex items-center justify-center rounded-[10px] haptic-press" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.2)', color: theme.textPrimary, fontSize: '16px', fontWeight: 600 }}>+</button>
                </div>
              </div>

              <div className="p-4 rounded-[20px] space-y-2 mt-2" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.2)', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="flex justify-between" style={{ fontSize: '12px', fontWeight: 500, color: theme.textMuted }}>
                  <span>Base Fee</span><span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '12px', fontWeight: 500, color: theme.textMuted }}>
                  <span>CGST + SGST (18%)</span><span>+ ₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b pb-2.5" style={{ fontSize: '12px', fontWeight: 500, color: theme.textMuted, borderColor: `${theme.textMuted}22` }}>
                  <span>Platform Secure Surcharge</span><span>+ ₹{serviceFee}</span>
                </div>
                <div className="flex justify-between pt-1 font-mono" style={{ fontSize: '14px', fontWeight: 700, color: theme.textPrimary }}>
                  <span>Total</span><span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <motion.button type="submit" disabled={isSubmitting} whileTap={{ scale: 0.96 }} transition={SPRING_IOS}
                className="w-full py-[18px] rounded-[18px] font-bold flex items-center justify-center gap-2 shadow-lg haptic-press mt-2"
                style={{ background: theme.accentGradient, color: '#FFFFFF', fontSize: '14px', letterSpacing: '-0.2px', boxShadow: activeMode === 'party' ? '0 4px 16px rgba(245,158,11,0.2)' : '0 4px 16px rgba(197,160,89,0.2), 0 1px 0 rgba(255,255,255,0.3) inset' }}
               >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>Confirm & Settle Voucher <ArrowRight size={18} /></>
                )}
              </motion.button>
              
              <div className="flex items-center justify-center gap-1.5 mt-3" style={{ fontSize: '10px', fontWeight: 600, color: theme.textMuted, letterSpacing: '0.2px' }}>
                <ShieldCheck size={14} className="text-[#34C759]" /> 256-Bit Encrypted Secure Booking Gateway
              </div>
            </motion.form>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-6">
              <div className="flex justify-center">
                <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center relative animate-bounce" style={{ background: 'rgba(52,199,89,0.1)', color: '#34C759' }}>
                  <TicketCheck size={40} />
                  <span className="absolute inset-0 rounded-full border border-[#34C759] animate-ping opacity-30" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold font-serif leading-tight text-[#34C759] tracking-tight">Kalyanmandap Pass</h3>
                <p className="mt-1" style={{ fontSize: '13px', fontWeight: 500, color: theme.textMuted }}>Booking confirmed instantly.</p>
              </div>

              {activeBooking && (
                <div className="rounded-[24px] text-left overflow-hidden relative" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,1)' : 'rgba(20,20,20,1)', boxShadow: activeMode === 'rooms' ? '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' : '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>
                  <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full -translate-y-1/2" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,20,0.85)', boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.05)' }} />
                  <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full -translate-y-1/2" style={{ background: activeMode === 'rooms' ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,20,0.85)', boxShadow: 'inset 2px 0 3px rgba(0,0,0,0.05)' }} />

                  <div className="p-5 border-b border-dashed flex justify-between items-center" style={{ borderColor: `${theme.textMuted}33` }}>
                    <div>
                      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: theme.textMuted, opacity: 0.8 }}>PASS ID</p>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: theme.textPrimary, fontFamily: 'monospace' }}>{activeBooking.id}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: theme.textMuted, opacity: 0.8 }}>STATUS</p>
                      <span style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px', color: '#34C759', background: 'rgba(52,199,89,0.1)', padding: '2px 6px', borderRadius: '4px' }}>CONFIRMED</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: theme.textMuted, opacity: 0.8 }}>VENUE RESERVED</span>
                      <span className="block mt-0.5" style={{ fontSize: '15px', fontWeight: 800, color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-0.2px' }}>{activeBooking.listingTitle}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                       <div><span style={{ fontSize: '9px', fontWeight: 700, color: theme.textMuted }}>DATE</span><span className="block mt-0.5" style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary, fontFamily: 'monospace' }}>{activeBooking.date}</span></div>
                       <div><span style={{ fontSize: '9px', fontWeight: 700, color: theme.textMuted }}>SLOT TIME</span><span className="block mt-0.5" style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary, fontFamily: 'monospace' }}>{activeBooking.selectedSlot}</span></div>
                       <div><span style={{ fontSize: '9px', fontWeight: 700, color: theme.textMuted }}>HOLDER</span><span className="block mt-0.5" style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>{activeBooking.customerName}</span></div>
                       <div><span style={{ fontSize: '9px', fontWeight: 700, color: theme.textMuted }}>CAPACITY</span><span className="block mt-0.5" style={{ fontSize: '13px', fontWeight: 600, color: theme.textPrimary }}>{activeBooking.guestsCount} Heads</span></div>
                    </div>
                    <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: `${theme.textMuted}22` }}>
                      <div>
                        <span style={{ fontSize: '9px', fontWeight: 700, color: theme.textMuted }}>TOTAL PAID</span>
                        <span className="block mt-0.5" style={{ fontSize: '18px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.3px', fontFamily: '"Space Grotesk", sans-serif' }}>{activeBooking.totalAmount}</span>
                      </div>
                      <div className="p-1.5 bg-white rounded-xl shadow-sm"><QrCode size={48} color="#000" /></div>
                    </div>
                  </div>
                </div>
              )}

              <motion.button onClick={onClose} whileTap={{ scale: 0.96 }} transition={SPRING_IOS} className="w-full py-[18px] rounded-[18px] font-bold shadow-lg haptic-press mt-2" style={{ background: theme.accentGradient, color: '#FFFFFF', fontSize: '14px', letterSpacing: '-0.2px' }}>
                Dismiss & View Dashboard
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
