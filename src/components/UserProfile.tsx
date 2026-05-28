import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, Sparkles, MapPin, Phone, Award, Compass, HeartHandshake, 
  QrCode, Camera, CheckCircle2, AlertCircle, TicketCheck, Trash2, Sparkle
} from 'lucide-react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import { Booking, Mode } from '../types';

interface UserProfileProps {
  theme: any;
  activeMode: Mode;
  bookings: Booking[];
  isDark: boolean;
  onCancel: (id: string) => void;
  onCheckIn: (bookingId: string) => void;
}

type ProfileView = 'ledger' | 'passes' | 'scanner';

export const SPRING_IOS = { type: "spring", stiffness: 400, damping: 30 } as const;

const QRCodeImage = ({ value, theme }: { value: string; theme: any }) => {
  const [src, setSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { 
      margin: 1, 
      width: 154,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
      .then(url => { if (active) { setSrc(url); setLoading(false); }})
      .catch(err => { setLoading(false); });
    return () => { active = false; };
  }, [value]);

  if (loading) {
    return (
      <div className="w-[120px] h-[120px] rounded-[16px] flex items-center justify-center animate-pulse border font-mono text-[9px]" style={{ background: theme.bg, borderColor: `${theme.textMuted}1a`, color: theme.textMuted }}>
        GENERATING PASS...
      </div>
    );
  }

  return (
    <div className="p-1.5 bg-white rounded-[20px] border shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
      <img src={src || ''} alt="Pass QR" className="w-[110px] h-[110px] object-contain rounded-xl" referrerPolicy="no-referrer" />
    </div>
  );
};

export default function UserProfile({ theme, activeMode, bookings, isDark, onCancel, onCheckIn }: UserProfileProps) {
  const [currentView, setCurrentView] = useState<ProfileView>('ledger');
  const [userName, setUserName] = useState(() => localStorage.getItem('ok_user_name') || "Siddharth Pradhan");
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('ok_user_phone') || "+91 98610 56783");
  const [district, setDistrict] = useState(() => localStorage.getItem('ok_user_district') || "Bhubaneswar Khorda");
  const [scannerActive, setScannerActive] = useState(false);
  const [scanResult, setScanResult] = useState<Booking | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => { localStorage.setItem('ok_user_name', userName); }, [userName]);
  useEffect(() => { localStorage.setItem('ok_user_phone', userPhone); }, [userPhone]);
  useEffect(() => { localStorage.setItem('ok_user_district', district); }, [district]);

  useEffect(() => {
    if (currentView !== 'scanner') stopCamera();
    return () => stopCamera();
  }, [currentView]);

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioCtx.createGain();
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
      const osc1 = audioCtx.createOscillator();
      osc1.connect(gainNode);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc1.start(); osc1.stop(audioCtx.currentTime + 0.1);
    } catch (err) {}
  };

  const startCamera = async () => {
    setCameraError(null); setScanResult(null); setScannerActive(true);
    try {
      if (streamRef.current) stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
      }
      animationFrameRef.current = requestAnimationFrame(tickScanning);
    } catch (err: any) {
      setCameraError("Camera access denied or device not found.");
    }
  };

  const stopCamera = () => {
    setScannerActive(false);
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (animationFrameRef.current) { cancelAnimationFrame(animationFrameRef.current); animationFrameRef.current = null; }
  };

  const tickScanning = () => {
    if (!videoRef.current || !streamRef.current || currentView !== 'scanner') return;
    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });
        if (code?.data) {
          const target = bookings.find(b => b.id === code.data.trim());
          if (target) { handleCheckInResolve(target); return; }
        }
      }
    }
    animationFrameRef.current = requestAnimationFrame(tickScanning);
  };

  const handleCheckInResolve = (booking: Booking) => {
    playSuccessSound(); onCheckIn(booking.id); setScanResult({ ...booking, checkedIn: true }); stopCamera();
  };

  return (
    <div className="w-full h-full pb-16">
      <div className="flex justify-between items-center mb-5 mt-2 px-1">
        <div>
          <h2 style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.8px', color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif' }}>
            Account Ledger
          </h2>
          <p style={{ fontSize: '13px', fontWeight: 500, color: theme.textMuted }}>Manage identity and digital gate passes</p>
        </div>
        <Crown size={24} style={{ color: theme.accent }} />
      </div>

      {/* iOS Segmented Control */}
      <div className={`relative flex p-[3px] rounded-[14px] mb-6 ${activeMode === 'rooms' ? 'glass-light' : 'glass-dark'}`}>
        <motion.div
          layoutId="profile-segment-active"
          className="absolute top-[3px] bottom-[3px] rounded-[11px] shadow-sm"
          style={{ 
            left: currentView === 'ledger' ? '3px' : currentView === 'passes' ? '33.33%' : 'calc(66.66% - 3px)',
            width: 'calc(33.33%)',
            background: activeMode === 'rooms' ? 'rgba(255,255,255,0.95)' : `linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(217,119,6,0.35) 100%)`,
            border: activeMode === 'rooms' ? '1px solid rgba(255,255,255,0.9)' : '1px solid rgba(245,158,11,0.3)',
            boxShadow: activeMode === 'rooms' ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset' : '0 0 12px rgba(245,158,11,0.15), 0 1px 3px rgba(0,0,0,0.3)',
          }}
          transition={SPRING_IOS}
        />
        {(['ledger', 'passes', 'scanner'] as ProfileView[]).map(view => (
          <button key={view} onClick={() => { setCurrentView(view); }} className={`flex-1 py-[10px] text-[12px] font-semibold z-10 transition-colors haptic-press capitalize ${currentView === view ? 'text-black dark:text-white' : ''}`} style={{ color: currentView === view ? (activeMode === 'rooms' ? '#1A1610' : '#FCD34D') : theme.textMuted, letterSpacing: '-0.1px' }}>
            {view === 'passes' ? `Passes (${bookings.length})` : view === 'scanner' ? 'Scan QR' : view}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'ledger' && (
          <motion.div key="ledger" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={SPRING_IOS} className="space-y-6">
            
            {/* VIP Card iOS Wallet Style */}
            <motion.div whileTap={{ scale: 0.98 }} transition={SPRING_IOS} className="relative rounded-[28px] p-6 overflow-hidden shadow-xl text-white haptic-press" style={{ background: activeMode === 'party' ? theme.accentGradient : 'linear-gradient(135deg, #1A1610 0%, #3D3428 100%)', boxShadow: activeMode === 'party' ? '0 8px 12px rgba(245,158,11,0.15)' : '0 12px 24px rgba(0,0,0,0.15)' }}>
              <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none opacity-40" />
              {/* Apple Wallet style top notch / hole punch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-3 bg-black/20 rounded-b-[10px]" />
              <div className="relative z-10 flex flex-col h-[160px] justify-between pt-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase py-1 px-2.5 bg-white/20 rounded-full font-bold backdrop-blur-md">PLATINUM MEMBER</span>
                    <h3 className="text-[26px] font-black mt-3 tracking-tight leading-none text-white shadow-sm" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{userName}</h3>
                  </div>
                  <Award className="w-10 h-10 text-white/80" />
                </div>
                <div className="flex justify-between items-end border-t border-white/20 pt-4">
                  <div>
                    <p className="text-[9px] font-mono tracking-wider text-white/70 font-semibold">LOCATION</p>
                    <div className="flex items-center gap-1.5 mt-1 font-bold text-[13px] text-white"><MapPin size={13} /> {district}</div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono tracking-wider text-white/70 font-semibold">STATUS</p>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#34C759] bg-[#34C759]/20 px-2 py-0.5 rounded-md mt-1 block backdrop-blur-md">ACTIVE</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Glass Tiles for Statistics */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-[24px] ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }}>
                <span className="text-[32px] font-black font-serif block" style={{ color: theme.textPrimary, lineHeight: 1 }}>{bookings.length}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted, marginTop: '8px', display: 'block' }}>Active Passes</span>
              </div>
              <div className={`p-4 rounded-[24px] ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }}>
                <span className="text-[24px] font-black block font-mono" style={{ color: theme.textPrimary, lineHeight: 1.2 }}>₹{bookings.length > 0 ? (bookings.reduce((acc, curr) => acc + (parseInt(curr.totalAmount.replace(/[^0-9]/g, ''), 10) || 0), 0)).toLocaleString('en-IN') : '0'}</span>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: theme.textMuted, marginTop: '8px', display: 'block' }}>Total Allocated</span>
              </div>
            </div>

            <div className={`rounded-[28px] p-5 ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }}>
              <span className="text-[10px] font-mono uppercase tracking-widest block text-center mb-5 font-bold" style={{ color: theme.textMuted }}>Update Ledger Data</span>
              <div className="space-y-4 text-left">
                {[
                  { label: "Full Name", val: userName, set: setUserName },
                  { label: "Verified Contact", val: userPhone, set: setUserPhone },
                  { label: "Home District", val: district, set: setDistrict }
                ].map((field, idx) => (
                  <div key={idx}>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: theme.textMuted, fontFamily: 'monospace' }}>{field.label}</label>
                    <input type="text" value={field.val} onChange={(e) => field.set(e.target.value)} className="w-full font-medium p-3.5 focus:outline-none transition-all ios-input" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, borderRadius: '14px', border: `1px solid ${activeMode === 'rooms' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'}`, fontSize: '14px' }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentView === 'passes' && (
          <motion.div key="passes" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={SPRING_IOS} className="space-y-4">
            {bookings.length === 0 ? (
              <div className={`text-center py-20 px-4 rounded-[28px] border border-dashed ${activeMode === 'rooms' ? 'glass-light' : 'glass-dark'}`} style={{ borderColor: `${theme.textMuted}33` }}>
                <Compass size={32} className="mx-auto mb-3 opacity-40" style={{ color: theme.accent }} />
                <h4 className="font-serif font-bold text-[15px]" style={{ color: theme.textPrimary }}>No Gate Passes Yet</h4>
                <p className="text-[12px] mt-1 max-w-[220px] mx-auto font-medium" style={{ color: theme.textMuted }}>Your active bookings will generate scannable Apple Wallet-style cards here.</p>
              </div>
            ) : (
              bookings.map((booking) => {
                const isSelected = activeTicketId === booking.id;
                return (
                  <motion.div layout key={booking.id} className={`rounded-[28px] overflow-hidden relative shadow-sm ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }} transition={SPRING_IOS}>
                    <div className="absolute top-[80px] -left-4 w-8 h-8 rounded-full z-10" style={{ background: activeMode === 'rooms' ? '#F2EDE8' : '#080608', boxShadow: activeMode === 'rooms' ? 'inset -2px 0 4px rgba(0,0,0,0.04)' : 'inset -2px 0 4px rgba(255,255,255,0.04)' }} />
                    <div className="absolute top-[80px] -right-4 w-8 h-8 rounded-full z-10" style={{ background: activeMode === 'rooms' ? '#F2EDE8' : '#080608', boxShadow: activeMode === 'rooms' ? 'inset 2px 0 4px rgba(0,0,0,0.04)' : 'inset 2px 0 4px rgba(255,255,255,0.04)' }} />

                    <div className="p-5 flex gap-3 items-center border-b border-dashed" style={{ borderColor: `${theme.textMuted}33` }}>
                      <img src={booking.listingImg} alt={booking.listingTitle} className="w-12 h-12 object-cover rounded-[14px]" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: theme.accent }}>{booking.tier} ID</span>
                        <h4 className="font-black text-[15px] leading-tight truncate" style={{ color: theme.textPrimary, fontFamily: '"Space Grotesk", sans-serif' }}>{booking.listingTitle}</h4>
                      </div>
                      <div className="shrink-0 text-right">
                        {booking.checkedIn ? (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 shadow-xs flex items-center gap-1 font-mono"><CheckCircle2 size={11} strokeWidth={2.5} /> SCANNED</span>
                        ) : (
                          <span className="text-[9px] font-bold font-mono animate-pulse uppercase" style={{ color: theme.accent }}>● VALID PASS</span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        <div><span className="text-[10px] block uppercase font-bold mb-0.5" style={{ color: theme.textMuted }}>DATE</span><span className="font-bold text-[13px] font-mono" style={{ color: theme.textPrimary }}>{booking.date}</span></div>
                        <div><span className="text-[10px] block uppercase font-bold mb-0.5" style={{ color: theme.textMuted }}>SLOT TIME</span><span className="font-bold text-[13px] font-mono" style={{ color: theme.textPrimary }}>{booking.selectedSlot}</span></div>
                        <div><span className="text-[10px] block uppercase font-bold mb-0.5" style={{ color: theme.textMuted }}>VISITOR</span><span className="font-bold truncate text-[13px] block" style={{ color: theme.textPrimary }}>{booking.customerName}</span></div>
                         <div><span className="text-[10px] block uppercase font-bold mb-0.5" style={{ color: theme.textMuted }}>PAID</span><span className="font-black text-[14px]" style={{ color: theme.textPrimary }}>{booking.totalAmount}</span></div>
                      </div>

                      <div className="pt-2">
                        <button onClick={() => setActiveTicketId(isSelected ? null : booking.id)} className="w-full py-3 rounded-[14px] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center haptic-press" style={{ background: activeMode === 'rooms' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', color: theme.textPrimary, border: `1px solid ${theme.textMuted}22` }}>
                          <QrCode size={14} /> {isSelected ? 'Hide Secure QR Pass' : 'Show Scannable Pass'}
                        </button>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={SPRING_IOS} className="overflow-hidden flex flex-col items-center justify-center pt-4">
                            <QRCodeImage value={booking.id} theme={theme} />
                            <p className="text-[10px] font-mono font-bold tracking-widest text-center mt-3" style={{ color: theme.textPrimary }}>{booking.id}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!booking.checkedIn && (
                      <div className="p-4 border-t flex justify-between items-center bg-black/5 dark:bg-white/5" style={{ borderColor: `${theme.textMuted}22` }}>
                        <span className="text-[10px] font-medium" style={{ color: theme.textMuted }}>Waiting for gate scan validation.</span>
                        <button onClick={() => onCancel(booking.id)} className="text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 px-3.5 py-2 rounded-[10px] flex items-center gap-1.5 haptic-press"><Trash2 size={12} /> Cancel</button>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}

        {currentView === 'scanner' && (
          <motion.div key="scanner" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-5">
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: theme.textPrimary, letterSpacing: '-0.5px' }}>Gate Validation Console</h2>
              <p style={{ fontSize: '12px', fontWeight: 500, color: theme.textMuted }}>Align customer QR passes for instant check-in</p>
            </div>

            <div className={`relative rounded-[32px] overflow-hidden aspect-[4/5] sm:aspect-video flex flex-col items-center justify-center shadow-lg ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }}>
              
              {/* Animated Pulsing Laser Scanner Frame */}
              {scannerActive && !scanResult && (
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      boxShadow: ['0px 0px 4px 0px rgba(52,199,89,0)', '0px 0px 40px 10px rgba(52,199,89,0.3)', '0px 0px 4px 0px rgba(52,199,89,0)'],
                      borderColor: ['rgba(52,199,89,0.2)', 'rgba(52,199,89,0.8)', 'rgba(52,199,89,0.2)'],
                      scale: [0.99, 1.01, 0.99]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-56 h-56 border-2 rounded-[32px] relative overflow-hidden backdrop-blur-[1px] bg-emerald-500/5"
                  >
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_12px_2px_rgba(52,199,89,0.5)]" 
                    />
                  </motion.div>
                </div>
              )}

              <AnimatePresence>
                {scanResult && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 bg-[#34C759]/20 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
                    <motion.div initial={{ scale: 0.9, y: 15 }} animate={{ scale: 1, y: 0 }} transition={SPRING_IOS} className="p-6 rounded-[28px] max-w-[280px] shadow-2xl relative bg-white dark:bg-[#1C1C1E] border border-white/20">
                      <CheckCircle2 className="w-14 h-14 text-[#34C759] mx-auto animate-bounce mb-3" strokeWidth={2.5} />
                      <h4 className="font-serif font-black text-[#34C759] text-[18px] leading-tight">VALID PASS</h4>
                      <p className="text-[10px] font-mono tracking-widest mt-1 text-zinc-500 dark:text-zinc-400">ID: {scanResult.id}</p>
                      <div className="my-4 border p-3 rounded-[16px] text-left space-y-2 text-[11px] font-semibold bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700">
                        <p className="truncate">👤 Holder: {scanResult.customerName}</p>
                        <p className="truncate">🎫 Target: {scanResult.listingTitle}</p>
                        <p className="truncate">🕒 Valid: {scanResult.selectedSlot}</p>
                      </div>
                      <button onClick={() => { setScanResult(null); startCamera(); }} className="w-full text-center py-3.5 rounded-[16px] text-[12px] font-bold text-white shadow-lg haptic-press" style={{ background: theme.accentGradient }}>
                        Scan Next Entry
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {scannerActive && !scanResult && <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />}

              {!scannerActive && !scanResult && (
                <div className="text-center p-6 space-y-4 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: theme.accentGradient }}>
                     <Camera size={28} className="text-white" />
                  </div>
                  <p className="text-[13px] max-w-[240px] font-medium leading-relaxed" style={{ color: theme.textMuted }}>
                    Offline Mode. Ignite camera metrics below to process attendees.
                  </p>
                  <button onClick={startCamera} className="w-full px-6 py-4 rounded-[16px] font-bold text-[13px] text-white shadow-lg haptic-press mt-2" style={{ background: theme.accentGradient }}>
                    Initialize Optical Matrix
                  </button>
                </div>
              )}

              {cameraError && !scanResult && (
                <div className="absolute inset-x-0 bottom-4 mx-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-[20px] flex items-start gap-2.5 text-[11px] font-medium leading-relaxed text-rose-500 text-left z-10 backdrop-blur-md">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{cameraError}</p>
                </div>
              )}
            </div>

            {/* Simulated tool */}
            <div className={`p-5 rounded-[28px] ${activeMode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`} style={{ border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)'}` }}>
              <div className="flex gap-2 items-center mb-2">
                <Sparkle size={14} className="text-amber-500 animate-spin" />
                <span className="text-[11px] uppercase font-bold tracking-wider" style={{ color: theme.textPrimary, fontFamily: 'monospace' }}>Sandbox Bypass</span>
              </div>
              <p className="text-[12px] mb-4 font-medium" style={{ color: theme.textMuted }}>
                No active device feed? Select an unresolved pass to simulate optical approval instantly.
              </p>
              {bookings.length === 0 ? (
                <div className="text-[11px] text-center py-3 border rounded-[16px] border-dashed font-medium" style={{ color: theme.textMuted, borderColor: `${theme.textMuted}33` }}>
                  No unresolved items in local stack. Book a venue.
                </div>
              ) : (
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 no-scrollbar">
                  {bookings.map((b) => (
                    <button key={b.id} onClick={() => handleCheckInResolve(b)} className="w-full text-left p-2.5 border rounded-[14px] text-[11px] font-bold flex justify-between items-center transition-all hover:scale-[1.01] haptic-press bg-black/5 dark:bg-white/5" style={{ borderColor: `${theme.textMuted}22` }}>
                      <span className="truncate" style={{ color: theme.textPrimary }}>🆔 {b.customerName}</span>
                      <span className="shrink-0 px-2.5 py-1 rounded-lg text-[9px] uppercase font-mono tracking-widest bg-white dark:bg-[#1A1A1A] shadow-sm ml-2" style={{ color: b.checkedIn ? theme.success : theme.accent, border: `1px solid ${b.checkedIn ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                        {b.checkedIn ? 'VALIDATED' : 'SIMULATE'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
