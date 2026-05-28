import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation, animate } from 'motion/react';
import { 
  MapPin, CheckCircle2, MessageSquare, 
  BedDouble, PartyPopper, Zap, Crown, Gem, Star,
  Plus, X, Home, Search, User, Filter, SlidersHorizontal, ArrowLeft, HeartHandshake, Sparkles, Sun, Moon, TicketCheck
} from 'lucide-react';

import { Mode, Tier, Listing, Booking, Review } from './types';
import { INITIAL_LISTINGS, MOCK_REVIEWS } from './data';
import ListingCard from './components/ListingCard';
import BookingModal from './components/BookingModal';
import Reviews from './components/Reviews';
import UserProfile from './components/UserProfile';
import LiquidLoader from './components/LiquidLoader';

export const SPRING_IOS = { type: "spring", stiffness: 400, damping: 30 } as const;
export const SPRING_BOUNCY = { type: "spring", stiffness: 500, damping: 25 } as const;
export const SPRING_SLOW = { type: "spring", stiffness: 250, damping: 28 } as const;

const THEMES = {
  rooms: {
    light: {
      bg: '#FAF8F5',
      bgGradient: 'linear-gradient(160deg, #FAF8F5 0%, #F2EBE0 50%, #FAF8F5 100%)',
      card: '#FFFFFF',
      cardBorder: 'rgba(0,0,0,0.06)',
      sidebarBg: 'rgba(250,248,245,0.9)',
      textPrimary: '#1C1A27',
      textSecondary: '#3D3428',
      textMuted: '#8B8897',
      accent: '#C5A059',
      accentHover: '#B48E48',
      accentLight: '#D4B87A',
      accentGlow: 'rgba(197,160,89,0.15)',
      accentGradient: 'linear-gradient(135deg, #C5A059 0%, #E8C87A 50%, #C5A059 100%)',
      skeleton: 'linear-gradient(90deg, #EBE9E6 0%, #F5F3F0 50%, #EBE9E6 100%)',
      badge: '#10B981',
    },
    dark: {
      bg: '#1A1812',
      bgGradient: 'linear-gradient(160deg, #1A1812 0%, #211E14 50%, #1A1812 100%)',
      card: '#231F16',
      cardBorder: 'rgba(255,255,255,0.08)',
      sidebarBg: 'rgba(20,18,12,0.95)',
      textPrimary: '#F5EDD8',
      textSecondary: '#D4C8A8',
      textMuted: '#7A7060',
      accent: '#D4A843',
      accentHover: '#C09030',
      accentLight: '#E8C070',
      accentGlow: 'rgba(212,168,67,0.15)',
      accentGradient: 'linear-gradient(135deg, #B8902E 0%, #D4A843 50%, #E8C070 100%)',
      skeleton: 'linear-gradient(90deg, #2A2418 0%, #332D20 50%, #2A2418 100%)',
      badge: '#10B981',
    }
  },
  party: {
    light: {
      bg: '#FDF8EE',
      bgGradient: 'linear-gradient(160deg, #FDF8EE 0%, #F8F0DC 50%, #FDF8EE 100%)',
      card: '#FFFFFF',
      cardBorder: 'rgba(0,0,0,0.06)',
      sidebarBg: 'rgba(253,248,238,0.95)',
      textPrimary: '#1A1000',
      textSecondary: '#3D2E00',
      textMuted: '#8A7040',
      accent: '#D97706',
      accentHover: '#B45309',
      accentLight: '#F59E0B',
      accentGlow: 'rgba(217,119,6,0.12)',
      accentGradient: 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)',
      skeleton: 'linear-gradient(90deg, #F0E8D0 0%, #F8F0E0 50%, #F0E8D0 100%)',
      badge: '#10B981',
    },
    dark: {
      bg: '#0A0800',
      bgGradient: 'linear-gradient(160deg, #0A0800 0%, #120E00 50%, #0A0800 100%)',
      card: '#14100A',
      cardBorder: 'rgba(245,158,11,0.1)',
      sidebarBg: 'rgba(10,8,0,0.95)',
      textPrimary: '#FFF8E8',
      textSecondary: '#E8D5A0',
      textMuted: '#8A7840',
      accent: '#F59E0B',
      accentHover: '#D97706',
      accentLight: '#FCD34D',
      accentGlow: 'rgba(245,158,11,0.15)',
      accentGradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 50%, #FCD34D 100%)',
      skeleton: 'linear-gradient(90deg, #1A1400 0%, #231C00 50%, #1A1400 100%)',
      badge: '#10B981',
    }
  }
};

const ODISHA_CITIES = ["All Cities", "Bhubaneswar", "Puri", "Cuttack", "Sambalpur", "Rourkela"] as const;

const SkeletonCard = ({ theme, mode }: { theme: any, mode: Mode }) => (
  <div 
    className={`w-full rounded-3xl p-4 mb-6 transition-all duration-300 border shadow-sm ${mode === 'rooms' ? 'glass-card-light' : 'glass-card-dark'}`}
  >
    <div className="w-full h-52 rounded-2xl mb-4 shimmer-box" />
    <div className="w-2/3 h-5 rounded-lg mb-2.5 shimmer-box" />
    <div className="w-1/2 h-4 rounded-lg mb-6 shimmer-box" />
    <div className="w-full h-12 rounded-xl shimmer-box" />
  </div>
);

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ok_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('ok_dark_mode', String(isDark));
  }, [isDark]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const [activeMode, setActiveMode] = useState<Mode>(() => {
    return (localStorage.getItem('ok_active_mode') as Mode) || 'rooms';
  });
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reviews' | 'profile'>(() => {
    return (localStorage.getItem('ok_active_tab') as any) || 'home';
  });
  const [userName] = useState(() => localStorage.getItem('ok_user_name') || 'Guest User');
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const theme = THEMES[activeMode][isDark ? 'dark' : 'light'];
  const controls = useAnimation();

  useEffect(() => { localStorage.setItem('ok_active_mode', activeMode); }, [activeMode]);
  useEffect(() => { localStorage.setItem('ok_active_tab', activeTab); }, [activeTab]);

  const [pullHeight, setPullHeight] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const hasVibrated = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
      hasVibrated.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isLoading) return;
    const y = e.touches[0].clientY;
    const diff = y - touchStartY.current;

    if (diff > 0 && scrollRef.current && scrollRef.current.scrollTop <= 0) {
      const resist = Math.min(diff * 0.45, 180);
      setPullHeight(resist);
      
      if (resist > 100 && !hasVibrated.current) {
        if (navigator.vibrate) navigator.vibrate(25);
        hasVibrated.current = true;
      } else if (resist <= 100 && hasVibrated.current) {
        hasVibrated.current = false;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (pullHeight > 100 && !isLoading) {
      if (navigator.vibrate) navigator.vibrate([10, 40, 10]);
      handleRefresh();
    } else if (!isLoading) {
      animate(pullHeight, 0, { ...SPRING_IOS, onUpdate: (latest) => setPullHeight(latest) });
    }
    hasVibrated.current = false;
  };

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('ok_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ok_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('ok_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [bookingModal, setBookingModal] = useState<{ isOpen: boolean; listing: Listing | null; preselectedSlot?: string }>({
    isOpen: false,
    listing: null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [sortByPrice, setSortByPrice] = useState<'lowToHigh' | 'highToLow' | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const geolocatedCityKey = 'ok_has_geolocated';
    if (sessionStorage.getItem(geolocatedCityKey)) return;

    const CITIES_COORDS = [
      { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245 },
      { name: 'Puri', lat: 19.8135, lon: 85.8312 },
      { name: 'Cuttack', lat: 20.4625, lon: 85.8830 },
      { name: 'Sambalpur', lat: 21.4666, lon: 83.9812 },
      { name: 'Rourkela', lat: 22.2604, lon: 84.8536 }
    ];

    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const p = 0.017453292519943295;
      const c = Math.cos;
      const a = 0.5 - c((lat2 - lat1) * p) / 2 + c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p)) / 2;
      return 12742 * Math.asin(Math.sqrt(a));
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        let nearestCity = 'All Cities';
        let minDistance = Infinity;

        CITIES_COORDS.forEach(city => {
          const distance = getDistance(latitude, longitude, city.lat, city.lon);
          // Auto select if within reasonable distance (e.g. 150km)
          if (distance < minDistance && distance < 150) {
            minDistance = distance;
            nearestCity = city.name;
          }
        });

        if (nearestCity !== 'All Cities') {
          setSelectedCity(nearestCity);
        }
        sessionStorage.setItem(geolocatedCityKey, 'true');
      },
      (error) => {
        console.log('Geolocation error:', error);
        sessionStorage.setItem(geolocatedCityKey, 'true');
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  useEffect(() => { localStorage.setItem('ok_listings', JSON.stringify(listings)); }, [listings]);
  useEffect(() => { localStorage.setItem('ok_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('ok_reviews', JSON.stringify(reviews)); }, [reviews]);

  const handleRefresh = () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.frequency.setValueAtTime(120, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.15);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch (e) {}

    animate(pullHeight, 130, {
      ...SPRING_IOS,
      onUpdate: (latest) => setPullHeight(latest),
      onComplete: () => {
        setTimeout(() => {
          setIsLoading(false);
          animate(130, 0, { ...SPRING_BOUNCY, onUpdate: (latest) => setPullHeight(latest) });
        }, 1200);
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    animate(0, 130, {
      ...SPRING_IOS,
      onUpdate: (latest) => setPullHeight(latest),
      onComplete: () => {
        setTimeout(() => {
          setIsLoading(false);
          animate(130, 0, { ...SPRING_BOUNCY, onUpdate: (latest) => setPullHeight(latest) });
        }, 1100);
      }
    });
  }, [activeMode]);

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    setListings(prevListings => {
      return prevListings.map(listing => {
        if (listing.id === newBooking.listingId) {
          const updatedSlots = listing.slots.map(slot => {
            if (slot.time === newBooking.selectedSlot) {
              return { ...slot, status: 'Booked' as const };
            }
            return slot;
          });
          return { ...listing, slots: updatedSlots };
        }
        return listing;
      });
    });
  };

  const handleCancelBooking = (bookingId: string) => {
    const deleted = bookings.find(b => b.id === bookingId);
    if (!deleted) return;
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setListings(prevListings => {
      return prevListings.map(listing => {
        if (listing.id === deleted.listingId) {
          const updatedSlots = listing.slots.map(slot => {
            if (slot.time === deleted.selectedSlot) {
              return { ...slot, status: 'Available' as const };
            }
            return slot;
          });
          return { ...listing, slots: updatedSlots };
        }
        return listing;
      });
    });
  };

  const handleAddReview = (newReviewData: { author: string; text: string; rating: number; listingId: number }) => {
    const brandNew: Review = {
      id: `rev-${Date.now()}`,
      listingId: newReviewData.listingId,
      author: newReviewData.author,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?auto=format&fit=crop&q=80&w=80`,
      rating: newReviewData.rating,
      text: newReviewData.text,
      date: "Today",
      likes: 0
    };
    setReviews(prev => [brandNew, ...prev]);
    setListings(prevListings => {
      return prevListings.map(listing => {
        if (listing.id === newReviewData.listingId) {
          const newRatingAverage = Math.min(5, ((listing.rating * 4) + newReviewData.rating) / 5);
          return { ...listing, rating: Number(newRatingAverage.toFixed(1)) };
        }
        return listing;
      });
    });
  };

  const getFilteredListings = () => {
    let filtered = listings.filter(item => item.mode === activeMode);
    if (selectedCity !== 'All Cities') filtered = filtered.filter(item => item.location.toLowerCase() === selectedCity.toLowerCase());
    if (selectedTier) filtered = filtered.filter(item => item.tier === selectedTier);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) || item.amenities.some(a => a.toLowerCase().includes(q))
      );
    }
    if (sortByPrice === 'lowToHigh') filtered = [...filtered].sort((a, b) => a.priceNum - b.priceNum);
    else if (sortByPrice === 'highToLow') filtered = [...filtered].sort((a, b) => b.priceNum - a.priceNum);
    return filtered;
  };

  const filteredItems = getFilteredListings();

  const handleTierToggle = (tier: Tier) => {
    setSelectedTier(prev => prev === tier ? null : tier);
    setIsMenuOpen(false);
  };

  return (
    <main className="min-h-screen w-full transition-colors duration-700" style={{ background: theme.bg }}>
      
      {/* DESKTOP: 3-column layout */}
      <div className="hidden lg:flex min-h-screen w-full">
        {/* LEFT SIDEBAR — 260px */}
        <aside className="w-[260px] shrink-0 border-r flex flex-col px-6 py-8 sticky top-0 h-screen overflow-y-auto"
          style={{ borderColor: `${theme.textMuted}18`, background: theme.sidebarBg }}>
          
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: theme.textPrimary }}>
              OK{activeMode === 'rooms' ? (
                <span className="bg-clip-text text-transparent inline-block" style={{ 
                  backgroundImage: 'linear-gradient(90deg, #C5A059 0%, #F0D080 35%, #E8C050 55%, #C5A059 80%, #F5E090 100%)', 
                  backgroundSize: '200% auto', 
                  animation: 'goldShimmer 3s linear infinite' 
                }}>.</span>
              ) : (
                <span style={{ color: theme.accent }}>.</span>
              )}
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: theme.textMuted }}>
              {activeMode === 'rooms' ? 'Odisha Suites' : 'Odisha Kalyanmandap'}
            </p>
          </div>

          {/* Mode Toggle — vertical pills on desktop */}
          <div className="space-y-2 mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-3" style={{ color: theme.textMuted }}>Mode</p>
            <button onClick={() => setActiveMode('rooms')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeMode === 'rooms' ? theme.accent : 'transparent',
                color: activeMode === 'rooms' ? '#fff' : theme.textMuted,
                border: `1px solid ${activeMode === 'rooms' ? theme.accent : theme.textMuted + '22'}`
              }}>
              <BedDouble size={15} /> Suites / Rooms
            </button>
            <button onClick={() => setActiveMode('party')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: activeMode === 'party' ? theme.accent : 'transparent',
                color: activeMode === 'party' ? '#fff' : theme.textMuted,
                border: `1px solid ${activeMode === 'party' ? theme.accent : theme.textMuted + '22'}`
              }}>
              <PartyPopper size={15} /> Kalyanmandaps
            </button>
          </div>

          {/* City Filter — desktop sidebar */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-3" style={{ color: theme.textMuted }}>City</p>
            {ODISHA_CITIES.map(city => (
              <button key={city} onClick={() => setSelectedCity(city)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium mb-1 transition-all"
                style={{
                  background: selectedCity === city ? `${theme.accent}18` : 'transparent',
                  color: selectedCity === city ? theme.accent : theme.textMuted,
                  fontWeight: selectedCity === city ? 700 : 400,
                }}>
                {selectedCity === city ? '● ' : '○ '} {city}
              </button>
            ))}
          </div>

          {/* Tier Filter — desktop sidebar */}
          <div className="mb-6">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-3" style={{ color: theme.textMuted }}>Tier</p>
            {[
              { tier: 'economy' as Tier, label: 'Economy', sub: 'Budget', color: '#3B82F6' },
              { tier: 'standard' as Tier, label: 'Standard', sub: 'Popular', color: '#F59E0B' },
              { tier: 'premium' as Tier, label: 'Premium', sub: 'Luxury', color: '#10B981' },
            ].map(t => (
              <button key={t.tier} onClick={() => handleTierToggle(t.tier)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs mb-1 transition-all"
                style={{
                  background: selectedTier === t.tier ? `${t.color}18` : 'transparent',
                  border: selectedTier === t.tier ? `1px solid ${t.color}44` : '1px solid transparent',
                  color: selectedTier === t.tier ? t.color : theme.textMuted,
                  fontWeight: selectedTier === t.tier ? 700 : 400,
                }}>
                <span>{t.label}</span>
                <span style={{ fontSize: 10, opacity: 0.6 }}>{t.sub}</span>
              </button>
            ))}
          </div>

          {/* Sort — desktop sidebar */}
          <div className="mb-8">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-3" style={{ color: theme.textMuted }}>Sort Price</p>
            <button onClick={() => setSortByPrice(p => p === 'lowToHigh' ? null : 'lowToHigh')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs mb-1 transition-all"
              style={{ color: sortByPrice === 'lowToHigh' ? theme.accent : theme.textMuted, fontWeight: sortByPrice === 'lowToHigh' ? 700 : 400 }}>
              ↑ Low to High
            </button>
            <button onClick={() => setSortByPrice(p => p === 'highToLow' ? null : 'highToLow')}
              className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
              style={{ color: sortByPrice === 'highToLow' ? theme.accent : theme.textMuted, fontWeight: sortByPrice === 'highToLow' ? 700 : 400 }}>
              ↓ High to Low
            </button>
          </div>

          {/* Desktop Navigation (so Reviews etc. are accessible) */}
          <div className="mt-auto">
            <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-3" style={{ color: theme.textMuted }}>Explore</p>
            {[
              { id: 'home', icon: Home, label: 'Explore' },
              { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
              { id: 'profile', icon: User, label: 'Account' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs mb-1 transition-all"
                style={{ color: activeTab === tab.id ? theme.accent : theme.textMuted, fontWeight: activeTab === tab.id ? 700 : 400 }}>
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* CENTER — main content area */}
        <main className="flex-1 px-8 py-8 overflow-y-auto">
          {/* Desktop top bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight" style={{ color: theme.textPrimary }}>
                {activeTab === 'profile' ? 'Account Dashboard' : activeTab === 'reviews' ? 'User Reviews' : activeMode === 'rooms' ? 'Suites & Rooms' : 'Kalyanmandap Venues'}
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.textMuted }}>
                {activeTab === 'profile' ? 'Manage your bookings and passes' : activeTab === 'reviews' ? `${reviews.length} total reviews` : `${filteredItems.length} options · ${selectedCity === 'All Cities' ? 'All Odisha' : selectedCity}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search bar — desktop top */}
              {activeTab !== 'reviews' && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border w-72 transition-all"
                  style={{ background: theme.card, borderColor: `${theme.textMuted}22` }}>
                  <Search size={14} style={{ color: theme.textMuted }} />
                  <input type="text" placeholder="Search venues, amenities..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 text-xs bg-transparent outline-none font-medium"
                    style={{ color: theme.textPrimary }} />
                </div>
              )}

              {/* Dark/Light mode toggle — desktop top right */}
              <button onClick={() => setIsDark(prev => !prev)}
                className="p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95"
                style={{ background: theme.card, borderColor: `${theme.textMuted}22`, color: theme.textMuted }}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>

          {/* Main View Area */}
          {activeTab === 'reviews' ? (
             <Reviews reviews={reviews} listings={listings} theme={theme} activeMode={activeMode} onAddReview={handleAddReview} isDark={isDark} />
          ) : (
            <>
              {/* Rooms Available Right Now Top Chips */}
              {activeMode === 'rooms' && (
                <div className="mb-6">
                  <div className="flex gap-2">
                    {['6AM-9AM', '9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'].map(slot => (
                      <button key={slot} className="px-4 py-1.5 rounded-full text-xs font-semibold hover:opacity-80 transition-opacity" style={{ background: `${theme.accent}1A`, color: theme.textSecondary, border: `1px solid ${theme.accent}40` }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="text-center py-24 px-4 rounded-3xl border border-dashed text-zinc-400 mt-10" style={{ borderColor: `${theme.textMuted}33` }}>
                  <Filter size={32} className="mx-auto mb-3 opacity-30" />
                  <h3 className="font-serif font-bold text-sm" style={{ color: theme.textPrimary }}>No Matches</h3>
                  <p className="text-xs mt-1 max-w-[200px] mx-auto leading-relaxed" style={{ color: theme.textMuted }}>Try clearing active filters or searching broader zones.</p>
                  {(selectedCity !== 'All Cities' || selectedTier || searchQuery) && (
                    <button onClick={() => { setSelectedCity('All Cities'); setSelectedTier(null); setSearchQuery(''); }} className="mt-4 px-4 py-2 border rounded-full text-[10px] font-mono uppercase bg-transparent hover:bg-black/5 font-bold cursor-pointer" style={{ borderColor: `${theme.textMuted}44`, color: theme.textPrimary }}>Clear All Filters</button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredItems.map((item, idx) => (
                    <ListingCard key={item.id} item={item} theme={theme} index={idx} activeMode={activeMode} isDark={isDark}
                      onBookClick={(lst, slot) => setBookingModal({ isOpen: true, listing: lst, preselectedSlot: slot })} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        {/* RIGHT PANEL — 320px */}
        <aside className="w-[320px] shrink-0 border-l px-6 py-8 sticky top-0 h-screen overflow-y-auto"
          style={{ borderColor: `${theme.textMuted}18`, background: theme.sidebarBg }}>
          
          <p className="text-[10px] font-mono uppercase tracking-wider font-bold mb-4" style={{ color: theme.textMuted }}>
            Your Bookings
          </p>
          {bookings.length === 0 ? (
            <div className="text-center py-16 opacity-40">
              <TicketCheck size={28} className="mx-auto mb-2" style={{ color: theme.textMuted }} />
              <p className="text-xs" style={{ color: theme.textMuted }}>No active passes yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map(b => (
                <div key={b.id} className="p-3 rounded-2xl border"
                  style={{ background: theme.card, borderColor: `${theme.textMuted}18` }}>
                  <p className="text-xs font-bold truncate" style={{ color: theme.textPrimary }}>{b.listingTitle}</p>
                  <p className="text-[10px] font-mono mt-0.5" style={{ color: theme.textMuted }}>{b.date} · {b.selectedSlot}</p>
                  <p className="text-[10px] font-bold mt-1" style={{ color: theme.accent }}>{b.checkedIn ? '✅ VALIDATED' : b.totalAmount}</p>
                </div>
              ))}
            </div>
          )}

          {/* Profile quick-access */}
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-full mt-8 p-4 rounded-2xl border flex items-center gap-3 transition-opacity hover:opacity-80 appearance-none text-left" 
            style={{ background: theme.card, borderColor: `${theme.textMuted}18`, cursor: 'pointer' }}
          >
            <div className="w-9 h-9 rounded-full flex shrink-0 items-center justify-center text-white text-sm font-black"
                 style={{ background: theme.accent }}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: theme.textPrimary }}>{userName}</p>
              <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>{bookings.length > 0 ? `${bookings.length} Active Pass${bookings.length > 1 ? 'es' : ''}` : 'Platinum Member'}</p>
            </div>
          </button>
        </aside>
      </div>

      {/* MOBILE: original layout — completely unchanged */}
      <div className="lg:hidden max-w-md mx-auto min-h-screen relative flex flex-col pb-36 shadow-2xl overflow-y-auto no-scrollbar" style={{ background: theme.bgGradient }}
        ref={scrollRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <LiquidLoader height={pullHeight} theme={theme} isRefreshing={isLoading} activeMode={activeMode} />

        <header className="px-5 safe-top pb-3 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <motion.h1
                key={activeMode}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[34px] font-black tracking-tight leading-none"
                style={{ fontFamily: '"Space Grotesk", sans-serif', color: theme.textPrimary, letterSpacing: '-0.5px' }}
              >
                {activeMode === 'rooms' ? (
                  <>OK{' '}
                    <span className="bg-clip-text text-transparent inline-block w-fit" style={{ 
                      backgroundImage: 'linear-gradient(90deg, #C5A059 0%, #F0D080 35%, #E8C050 55%, #C5A059 80%, #F5E090 100%)', 
                      backgroundSize: '200% auto', 
                      animation: 'goldShimmer 3s linear infinite' 
                    }}>Suites</span>
                  </>
                ) : (
                  <>OK <span style={{ color: theme.accent }}>Mandap</span></>
                )}
              </motion.h1>
              <p className="text-[12px] mt-1 tracking-wide font-medium bg-clip-text text-transparent inline-block w-fit" style={{ 
                ...(activeMode === 'rooms' ? {
                  backgroundImage: 'linear-gradient(90deg, #9A8060 0%, #C5A059 50%, #9A8060 100%)',
                  backgroundSize: '200% auto',
                  animation: 'goldShimmer 4s linear infinite',
                  animationDelay: '0.5s',
                } : {
                  backgroundImage: 'linear-gradient(90deg, #8A7020 0%, #D4A020 50%, #8A7020 100%)',
                  backgroundSize: '200% auto',
                  animation: 'goldShimmer 5s linear infinite',
                })
              }}>
                {activeMode === 'rooms' ? 'Hourly micro-stays across Odisha' : 'Premium party & wedding venues'}
              </p>
            </div>

            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsDark(prev => !prev)} className="w-10 h-10 rounded-full flex items-center justify-center border transition-all haptic-press" style={{ background: theme.card, borderColor: `${theme.textMuted}22`, color: theme.textMuted }}>
                {isDark ? <Sun size={16} style={{ color: '#F59E0B' }} /> : <Moon size={16} style={{ color: theme.textMuted }} />}
              </motion.button>
              <motion.div whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-full flex items-center justify-center border transition-all haptic-press" style={{ background: theme.card, borderColor: `${theme.textMuted}22`, color: theme.textMuted }}>
                <Sparkles size={16} style={{ color: theme.accent }} />
              </motion.div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-5 pt-2">
          {activeTab === 'home' && (
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={SPRING_IOS} className="space-y-6">
              
              {/* iOS Segmented Control */}
              <div
                className={`relative flex p-[3px] rounded-[14px] ${activeMode === 'rooms' ? 'glass-light' : 'glass-dark'}`}
                style={{ margin: '0 0 4px 0' }}
              >
                <motion.div
                  layoutId="ios-segment-active"
                  className="absolute inset-y-[3px] rounded-[11px] shadow-md"
                  style={{
                    left: activeMode === 'rooms' ? '3px' : '50%',
                    right: activeMode === 'rooms' ? '50%' : '3px',
                    background: activeMode === 'rooms'
                      ? 'rgba(255,255,255,0.95)'
                      : `linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(212,119,6,0.28) 100%)`,
                    border: activeMode === 'rooms'
                      ? '1px solid rgba(255,255,255,0.9)'
                      : '1px solid rgba(245,158,11,0.35)',
                    boxShadow: activeMode === 'rooms'
                      ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,0.8) inset'
                      : '0 4px 16px rgba(245,158,11,0.15), 0 1px 3px rgba(0,0,0,0.4)',
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />

                <button onClick={() => setActiveMode('rooms')}
                  className="flex-1 py-[10px] text-[12px] font-semibold z-10 flex items-center justify-center gap-1.5 relative haptic-press"
                  style={{
                    color: activeMode === 'rooms' ? '#1A1610' : theme.textMuted,
                    letterSpacing: '-0.1px'
                  }}
                >
                  <BedDouble size={13} fill={activeMode === 'rooms' ? '#1A1610' : 'none'} />
                  Suites & Rooms
                </button>

                <button onClick={() => setActiveMode('party')}
                  className="flex-1 py-[10px] text-[12px] font-semibold z-10 flex items-center justify-center gap-1.5 relative haptic-press"
                  style={{
                    color: activeMode === 'party' ? '#FFF8E8' : theme.textMuted,
                    letterSpacing: '-0.1px'
                  }}
                >
                  <PartyPopper size={13} />
                  Kalyanmandaps
                </button>
              </div>

              {activeMode === 'party' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span style={{ color: theme.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Featured Venues
                    </span>
                    <span style={{ color: theme.accent, fontSize: 11, fontWeight: 600 }}>See all</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                    {filteredItems.slice(0, 3).map((item) => (
                      <motion.div 
                        whileTap={{ scale: 0.95 }}
                        transition={SPRING_IOS}
                        onClick={() => setBookingModal({ isOpen: true, listing: item })}
                        key={item.id + "_feat"} 
                        className="shrink-0 w-[140px] h-[180px] rounded-2xl relative overflow-hidden haptic-press"
                        style={{ border: `1px solid rgba(245,158,11,0.25)`, boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}
                      >
                        <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-white font-bold text-[13px] leading-tight mb-1">{item.title}</p>
                          <p className="font-semibold text-[11px]" style={{ color: theme.accent }}>{item.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeMode === 'rooms' && (
                <div className="mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.5px] mb-2 block px-1" style={{ color: theme.textMuted }}>
                    Available Right Now
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['6AM-9AM', '9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'].map(slot => (
                      <button
                        key={slot}
                        className="shrink-0 px-4 py-2 rounded-[10px] text-[12px] font-semibold haptic-press"
                        style={{
                          background: 'rgba(197,160,89,0.1)',
                          border: '1px solid rgba(197,160,89,0.25)',
                          color: theme.textSecondary,
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p style={{ color: theme.textMuted, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                  {filteredItems.length} {selectedTier ? `${selectedTier} tier` : 'premium'} options
                  {selectedCity !== 'All Cities' ? ` in ${selectedCity}` : ' found'}
                </p>
                {selectedTier && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedTier(null)}
                    className="flex items-center gap-1 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full border text-white cursor-pointer active:scale-95"
                    style={{ backgroundColor: theme.accent, border: 'none' }}
                  >
                    Tier: {selectedTier} ✕
                  </motion.div>
                )}
              </div>

              <div className="space-y-1">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div key="skeleton-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      <SkeletonCard theme={theme} mode={activeMode} />
                      <SkeletonCard theme={theme} mode={activeMode} />
                    </motion.div>
                  ) : filteredItems.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`text-center py-24 px-4 rounded-3xl border border-dashed text-zinc-400 ${activeMode === 'rooms' ? 'glass-light' : 'glass-dark'}`} style={{ borderColor: `${theme.textMuted}33` }}>
                      <Filter size={32} className="mx-auto mb-3 opacity-30" />
                      <h3 className="font-serif font-bold text-sm" style={{ color: theme.textPrimary }}>No Matches in Odisha</h3>
                      <p className="text-xs mt-1 max-w-[200px] mx-auto leading-relaxed" style={{ color: theme.textMuted }}>Try clearing active filters or searching broader zones.</p>
                      {(selectedCity !== 'All Cities' || selectedTier || searchQuery) && (
                        <button onClick={() => { setSelectedCity('All Cities'); setSelectedTier(null); setSearchQuery(''); }} className="mt-4 px-4 py-2 border rounded-full text-[10px] font-mono uppercase bg-transparent hover:bg-black/5 font-bold cursor-pointer" style={{ borderColor: `${theme.textMuted}44`, color: theme.textPrimary }}>Clear All Filters</button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.15 } } }} className="space-y-4">
                      {filteredItems.map((item, idx) => (
                        <ListingCard key={item.id} item={item} theme={theme} index={idx} activeMode={activeMode} onBookClick={(lst: Listing, slot?: string) => setBookingModal({ isOpen: true, listing: lst, preselectedSlot: slot })} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={SPRING_IOS} className="space-y-5">
              <div>
                <h2 className="text-xl font-serif font-black tracking-tight" style={{ color: theme.textPrimary }}>Explore Odisha</h2>
                <p className="text-[11px]" style={{ color: theme.textMuted }}>Locate custom Kalyanmandaps or transit rooms instantly</p>
              </div>
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl ${activeMode === 'rooms' ? 'glass-light' : 'glass-dark'}`}>
                <div className="flex-1 flex items-center gap-2.5 px-3">
                  <Search size={15} style={{ color: theme.textMuted }} />
                  <input type="text" placeholder="Search by name, amenities, tier" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full text-xs font-semibold focus:outline-none py-1 border-0 bg-transparent" style={{ color: theme.textPrimary }} />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="p-1 text-zinc-400"><X size={12} /></button>}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold mb-2 block" style={{ color: theme.textMuted }}>District Region</span>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {ODISHA_CITIES.map((city) => (
                    <button key={city} onClick={() => setSelectedCity(city)} className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border cursor-pointer whitespace-nowrap transition-all duration-200 ${selectedCity === city ? 'shadow-sm text-white' : ''} ${activeMode === 'rooms' ? (selectedCity !== city && 'glass-light') : (selectedCity !== city && 'glass-dark')}`} style={{ backgroundColor: selectedCity === city ? theme.accent : 'transparent', borderColor: selectedCity === city ? theme.accent : `${theme.textMuted}22`, color: selectedCity === city ? '#FFFFFF' : theme.textPrimary }}>
                      {city}
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold" style={{ color: theme.textMuted }}>Price Sorting</span>
                  {sortByPrice && (
                    <span onClick={() => setSortByPrice(null)} className="text-[9px] font-bold uppercase cursor-pointer" style={{ color: theme.accent }}>Reset</span>
                  )}
                </div>
                <div className={`relative flex p-1 rounded-[16px] shadow-sm ${activeMode === 'rooms' ? 'bg-black/5' : 'bg-white/5'}`}>
                  {sortByPrice && (
                    <motion.div
                      layoutId="price-sort-indicator"
                      className="absolute inset-y-1 rounded-[12px] shadow-sm"
                      style={{
                        width: 'calc(50% - 4px)',
                        left: sortByPrice === 'lowToHigh' ? '4px' : 'calc(50%)',
                        background: activeMode === 'rooms' ? '#FFFFFF' : 'rgba(255,255,255,0.1)',
                        border: activeMode === 'rooms' ? '1px solid rgba(0,0,0,0.04)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <button 
                    onClick={() => setSortByPrice('lowToHigh')} 
                    className="flex-1 py-2 text-[11px] font-semibold flex items-center justify-center gap-1.5 relative z-10 haptic-press"
                    style={{ color: sortByPrice === 'lowToHigh' ? theme.accent : theme.textMuted }}
                  >
                    <SlidersHorizontal size={12} />
                    Budget First
                  </button>
                  <button 
                    onClick={() => setSortByPrice('highToLow')} 
                    className="flex-1 py-2 text-[11px] font-semibold flex items-center justify-center gap-1.5 relative z-10 haptic-press"
                    style={{ color: sortByPrice === 'highToLow' ? theme.accent : theme.textMuted }}
                  >
                    <Gem size={12} />
                    Luxurious First
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                 {filteredItems.map((item, idx) => (
                    <ListingCard key={item.id} item={item} theme={theme} index={idx} activeMode={activeMode} onBookClick={(lst: Listing, slot?: string) => setBookingModal({ isOpen: true, listing: lst, preselectedSlot: slot })} />
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={SPRING_IOS}>
               <Reviews reviews={reviews} listings={listings} theme={theme} activeMode={activeMode} onAddReview={handleAddReview} isDark={isDark} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.99 }} transition={SPRING_IOS}>
               <UserProfile theme={theme} activeMode={activeMode} bookings={bookings} onCancel={handleCancelBooking} onCheckIn={(id) => setBookings(prev => prev.map(b => b.id === id ? { ...b, checkedIn: true } : b))} isDark={isDark} />
            </motion.div>
          )}

        </div>        {/* PREMIUM FLOATING DOCK NAVIGATION */}
        <div className="fixed bottom-6 w-full max-w-md z-40 px-6 pointer-events-none pb-safe flex justify-center">
          <motion.div 
            layout
            className="flex items-center gap-1.5 p-1.5 rounded-full pointer-events-auto shadow-2xl relative"
            style={{ 
              background: activeMode === 'rooms' ? 'rgba(255,255,255,0.85)' : 'rgba(20,20,20,0.85)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: `1px solid ${activeMode === 'rooms' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.1)'}`,
              boxShadow: activeMode === 'rooms' ? '0 10px 40px -10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)' : '0 10px 40px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(245,158,11,0.08)'
            }}
          >
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'search', icon: Search, label: 'Find' },
              { id: 'reviews', icon: MessageSquare, label: 'Talk' },
              { id: 'profile', icon: User, label: 'Profile', notification: bookings.length }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setIsMenuOpen(false); }}
                  className="relative flex items-center justify-center p-3 rounded-full cursor-pointer haptic-press transition-colors"
                  style={{
                    color: isActive ? '#FFFFFF' : (activeMode === 'rooms' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'),
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute inset-0 rounded-full"
                      style={{ background: theme.accentGradient, boxShadow: activeMode === 'party' ? '0 4px 12px rgba(245,158,11,0.25)' : '0 2px 10px rgba(197,160,89,0.3)' }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={20} className={isActive ? "fill-white/20" : ""} strokeWidth={isActive ? 2.5 : 2} />
                    {isActive && <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} className="text-[12px] font-bold tracking-wide overflow-hidden whitespace-nowrap hidden sm:block">{tab.label}</motion.span>}
                  </div>
                  {tab.notification > 0 && !isActive && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
                  )}
                </button>
              );
            })}
            
            <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-1" />

            <div className="relative">
              <AnimatePresence>
                {isMenuOpen && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 backdrop-blur-md -z-10 pointer-events-auto cursor-pointer" style={{ background: 'radial-gradient(circle at 50% 100%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 80%)' }} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute',
                        top: -140,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.75)',
                        backdropFilter: 'blur(12px)',
                        border: '0.5px solid rgba(255,255,255,0.12)',
                        borderRadius: '20px',
                        padding: '5px 12px',
                        whiteSpace: 'nowrap',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.8px',
                        textTransform: 'uppercase',
                      }}
                    >
                      Filter by Tier
                    </motion.div>
                    {[
                      { icon: <Zap size={14} />, label: "Economy", sub: "Budget", tier: "economy" as Tier, x: -68, y: -65, color: '#3B82F6' },
                      { icon: <Star size={14} />, label: "Standard", sub: "Popular", tier: "standard" as Tier, x: 0, y: -100, color: '#F59E0B' },
                      { icon: <Gem size={14} />, label: "Premium", sub: "Luxury", tier: "premium" as Tier, x: 68, y: -65, color: '#10B981' },
                    ].map((btn, i) => {
                      const isActiveTier = selectedTier === btn.tier;
                      return (
                        <motion.button type="button" key={i} initial={{ scale: 0, opacity: 0, x: 0, y: 0 }} animate={{ scale: 1, opacity: 1, x: btn.x, y: btn.y }} exit={{ scale: 0, opacity: 0, x: 0, y: 0 }} onClick={() => handleTierToggle(btn.tier)} transition={{ ...SPRING_IOS, damping: 18, delay: i * 0.05 }} className="absolute left-1/2 -ml-[26px] flex items-center justify-center rounded-2xl shadow-lg cursor-pointer z-[100]" style={{ width: 52, height: 52, backgroundColor: isActiveTier ? btn.color : 'rgba(255,255,255,0.96)', border: isActiveTier ? 'none' : `1.5px solid ${btn.color}44`, color: isActiveTier ? '#FFFFFF' : '#1C1A27' }}>
                          {btn.icon}
                          <span style={{ position: 'absolute', bottom: -32, left: '50%', transform: 'translateX(-50%)', background: isActiveTier ? btn.color : 'rgba(20,18,14,0.9)', backdropFilter: 'blur(8px)', padding: '3px 8px 4px', borderRadius: 20, border: '0.5px solid rgba(255,255,255,0.1)', textAlign: 'center', whiteSpace: 'nowrap', minWidth: 58 }}>
                            <span style={{ display: 'block', color: '#FFFFFF', fontSize: '8px', fontWeight: 800, letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1.3 }}>{btn.label}</span>
                            <span style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '7px', fontWeight: 500, letterSpacing: '0.3px', lineHeight: 1.2 }}>{btn.sub}</span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </>
                )}
              </AnimatePresence>

              <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} animate={{ rotate: isMenuOpen ? 180 : 0 }} whileTap={{ scale: 0.9 }} transition={SPRING_IOS} className="flex flex-col gap-0.5 items-center justify-center cursor-pointer pointer-events-auto h-12 w-12 rounded-full z-50 relative" style={{ background: theme.accentGradient, boxShadow: activeMode === 'party' ? '0 4px 14px rgba(245,158,11,0.3)' : '0 4px 12px rgba(197,160,89,0.3)', border: 'none', color: '#FFF' }}>
                {isMenuOpen ? <X size={20} strokeWidth={2.5} /> : (
                  <>
                    <SlidersHorizontal size={14} />
                    <span style={{ fontSize: '7px', fontWeight: 800, letterSpacing: '0.5px', lineHeight: 1 }}>FILTER</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {bookingModal.isOpen && (
            <BookingModal isOpen={bookingModal.isOpen} listing={bookingModal.listing} preselectedSlot={bookingModal.preselectedSlot} theme={theme} activeMode={activeMode} isDark={isDark} onClose={() => setBookingModal({ isOpen: false, listing: null })} onSuccess={handleBookingSuccess} />
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
