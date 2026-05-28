/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Listing, Review } from './types';

export const INITIAL_LISTINGS: Listing[] = [
  // --- ROOMS (MICROSTAY / TRANSIT STATE) ---
  {
    id: 1,
    title: "Grand Heritage Suite",
    location: "Bhubaneswar",
    price: "₹1,200/hr",
    priceNum: 1200,
    views: 148,
    slots: [
      { time: "9AM - 12PM", status: "Available" },
      { time: "12PM - 3PM", status: "Booked" },
      { time: "3PM - 6PM", status: "Available" }
    ],
    status: "90% Booked",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=650",
    description: "Experience premium colonial-era royal heritage aesthetics in the heart of Odisha's capital city. Perfect for wedding transit, executive meetings, or bridal adjustments.",
    rating: 4.8,
    capacity: "2-4 Persons",
    amenities: ["King Bed", "High-speed Wi-Fi", "Bridal Dressing Kit", "Packaged Mineral Water", "AC"],
    tier: "premium",
    mode: "rooms"
  },
  {
    id: 2,
    title: "Executive Micro-Stay",
    location: "Puri",
    price: "₹850/hr",
    priceNum: 850,
    views: 284,
    slots: [
      { time: "6AM - 9AM", status: "Available" },
      { time: "10AM - 1PM", status: "Booked" },
      { time: "1PM - 4PM", status: "Available" },
      { time: "4PM - 7PM", status: "Available" }
    ],
    status: "⚡ Fast Filling",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=650",
    description: "Located within walking distance of the sacred Jagannath Temple and Odisha's pristine beaches. Ideal for quick refreshing before temple darshans or seaside events.",
    rating: 4.6,
    capacity: "2-3 Persons",
    amenities: ["Queen Bed", "Proximity to Beach", "Air Conditioning", "Darshan Kit", "Tea Coffee Maker"],
    tier: "standard",
    mode: "rooms"
  },
  {
    id: 3,
    title: "Cozy Transit Cabin",
    location: "Cuttack",
    price: "₹450/hr",
    priceNum: 450,
    views: 92,
    slots: [
      { time: "9AM - 12PM", status: "Available" },
      { time: "12PM - 3PM", status: "Available" },
      { time: "3PM - 6PM", status: "Booked" }
    ],
    status: "Value Champion",
    img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=650",
    description: "Clean, budget-conscious transit stay in the historic silver-city. Furnished with standard modern essentials with secure luggage holding.",
    rating: 4.2,
    capacity: "1-2 Persons",
    amenities: ["Double Bed", "Secure Locker", "Wi-Fi", "Ceiling Fan", "Desk"],
    tier: "economy",
    mode: "rooms"
  },
  {
    id: 4,
    title: "Royal Mayfair Pavilion Suite",
    location: "Bhubaneswar",
    price: "₹1,800/hr",
    priceNum: 1800,
    views: 312,
    slots: [
      { time: "10AM - 1PM", status: "Available" },
      { time: "1PM - 4PM", status: "Available" },
      { time: "4PM - 7PM", status: "Booked" },
      { time: "7PM - 10PM", status: "Available" }
    ],
    status: "👑 Imperial Tier",
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=650",
    description: "Ultra-premium executive sanctuary featuring traditional Odia architecture with contemporary luxury. Private patio, complimentary luxury lounge access, and mini-bar.",
    rating: 4.9,
    capacity: "4-5 Persons",
    amenities: ["Master Suite Bed", "Local Smart Assistant", "Odia Filigree Decor", "Lounge Access", "AC", "Luxury Toiletry Kits"],
    tier: "premium",
    mode: "rooms"
  },
  {
    id: 5,
    title: "Smart Transit Pods",
    location: "Sambalpur",
    price: "₹350/hr",
    priceNum: 350,
    views: 74,
    slots: [
      { time: "8AM - 11AM", status: "Available" },
      { time: "11AM - 2PM", status: "Available" },
      { time: "2PM - 5PM", status: "Available" }
    ],
    status: "Modern Compact",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=650",
    description: "Compact tech-integrated pod stay for travelers who want zero-fuss comfort and absolute security near the Sambalpur railway express hub.",
    rating: 4.4,
    capacity: "1 Person",
    amenities: ["Single Comfort Bed", "USB Ports / Chargers", "Smart LED Lights", "Dimmable Glow", "Shared Clean Washroom"],
    tier: "economy",
    mode: "rooms"
  },
  {
    id: 6,
    title: "Imperial Grand Suite",
    location: "Rourkela",
    price: "₹990/hr",
    priceNum: 990,
    views: 110,
    slots: [
      { time: "9AM - 1PM", status: "Available" },
      { time: "1PM - 5PM", status: "Booked" },
      { time: "5PM - 9PM", status: "Available" }
    ],
    status: "👔 Professional Choice",
    img: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=650",
    description: "Spacious luxury suite perfect for delegates and wedding organizers in the steel metropolis. Fully loaded executive workstation and room-service buffet option.",
    rating: 4.5,
    capacity: "3-4 Persons",
    amenities: ["King Pillow-top Bed", "High-speed Wi-Fi", "Flat Screen Cable TV", "Workspace Table", "AC"],
    tier: "standard",
    mode: "rooms"
  },

  // --- PARTY WALLS / BANQUETS / KALYANMANDAPS ---
  {
    id: 7,
    title: "The Velvet Lounge Banquet",
    location: "Cuttack",
    price: "₹15,000 / event",
    originalPrice: "₹20,000",
    discount: true,
    priceNum: 15000,
    views: 194,
    slots: [
      { time: "Morning Slot", status: "Booked" },
      { time: "Evening Slot", status: "Available" }
    ],
    status: "🔥 Trending",
    img: "https://images.unsplash.com/photo-1543157148-f68f214f3c18?auto=format&fit=crop&q=80&w=650",
    description: "A prestigious, visually majestic banquet venue in Cuttack, perfect for vibrant engagement rings-exchanges, thread-ceremonies, and grand anniversary feasts.",
    rating: 4.7,
    capacity: "150-300 Guests",
    amenities: ["Grand Chandelier", "Odia Buffet Kitchen", "Fully Air Conditioned", "Groom & Bride Dressing suites", "Stage Lighting Layout"],
    tags: ["💃 DJ Night", "🎵 Bollywood"],
    tier: "standard",
    mode: "party"
  },
  {
    id: 8,
    title: "Azure Sky Deck",
    location: "Bhubaneswar",
    price: "₹25,000 / event",
    priceNum: 25000,
    views: 345,
    slots: [
      { time: "Day Slot", status: "Available" },
      { time: "Night Slot", status: "Available" }
    ],
    status: "🔴 LIVE TONIGHT",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=650",
    description: "Odisha's preeminent rooftop open-air garden deck. Features high panoramic views of Bhubaneswar's master plan skies, stellar accent illumination, and modern mocktail bar.",
    rating: 4.9,
    capacity: "200-500 Guests",
    amenities: ["Open-air Star Deck", "Vapor Cooling Misters", "Infinity Pool Edge Backdrop", "Professional Acoustic Sound System", "In-house Catering Core"],
    tags: ["🍸 Cocktails", "🌙 Rooftop"],
    tier: "premium",
    mode: "party"
  },
  {
    id: 9,
    title: "Nilachala Kalyan Mandap",
    location: "Puri",
    price: "₹8,000 / event",
    originalPrice: "₹12,000",
    discount: true,
    priceNum: 8000,
    views: 124,
    slots: [
      { time: "Day Slot", status: "Booked" },
      { time: "Night Slot", status: "Available" }
    ],
    status: "Sacred Vows Choice",
    img: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=650",
    description: "Traditional wedding hall offering high sanctity and absolute comfort. Fully specialized for Odia sacred wedding customs (Varmala, Hasta-Sutran, and Prasadam-style feasts).",
    rating: 4.4,
    capacity: "400-800 Guests",
    amenities: ["Odia Brahmin/Vaidik Mandap", "Vast Dining Hall", "Ample Car Parking Area", "Puri Mahaprasad Serving Friendly", "Eco Venting"],
    tags: ["🛕 Traditional", "🍛 Mahaprasad"],
    tier: "economy",
    mode: "party"
  },
  {
    id: 10,
    title: "Vaishno Palace Grand",
    location: "Bhubaneswar",
    price: "₹35,000 / event",
    priceNum: 35000,
    views: 412,
    slots: [
      { time: "Day Slot", status: "Booked" },
      { time: "Night Slot", status: "Booked" }
    ],
    status: "👑 Pure Opulence",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=650",
    description: "The crown jewel of Bhubaneswar's event scene. Palatial architecture, golden pillars, sweeping grand entrance, and high-tech multimedia projectors for stellar visual presentations.",
    rating: 4.9,
    capacity: "500-1200 Guests",
    amenities: ["Centrally Ducted VRV AC", "Royal Entry Red Carpet", "Valet Parking Base", "5-Star Chef Catering Support", "Laser Lights Stage Setup"],
    tags: ["🍽️ Fine Dining", "✨ Luxury"],
    tier: "premium",
    mode: "party"
  },
  {
    id: 11,
    title: "Shaurya Residency Garden",
    location: "Sambalpur",
    price: "₹14,500 / event",
    originalPrice: "₹18,000",
    discount: true,
    priceNum: 14500,
    views: 105,
    slots: [
      { time: "Day Slot", status: "Available" },
      { time: "Night Slot", status: "Available" }
    ],
    status: "Scenic Outdoors",
    img: "https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&q=80&w=650",
    description: "Lush green manicured lawns paired with a modern indoor banquet hall, accommodating elegant engagement ceremonies, corporate retreats, or family reunions.",
    rating: 4.5,
    capacity: "150-400 Guests",
    amenities: ["Manicured Event Lawn", "Catering Workstations", "Power Backup Generators", "PA Sound System", "Decoration Layout customizable"],
    tags: ["🌳 Garden", "⛺ Outdoors"],
    tier: "standard",
    mode: "party"
  },
  {
    id: 12,
    title: "Swagat Banquet Hub",
    location: "Rourkela",
    price: "₹7,500 / event",
    priceNum: 7500,
    views: 89,
    slots: [
      { time: "Day Slot", status: "Available" },
      { time: "Night Slot", status: "Available" }
    ],
    status: "Budget Star",
    img: "https://images.unsplash.com/photo-1505232458627-5ec90be5864c?auto=format&fit=crop&q=80&w=650",
    description: "Extremely cost-effective, dependable banquet venue in Rourkela with clean structures, good local catering partners, and hospitable staff assistance.",
    rating: 4.1,
    capacity: "100-250 Guests",
    amenities: ["Affordable Buffet Setup", "Comfort Cooling Fans", "Sound System", "Free Self Parking", "Stage Platform"],
    tags: ["🎉 Core Event", "💸 Budget"],
    tier: "economy",
    mode: "party"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    listingId: 1,
    author: "Aditya Mohapatra",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80",
    rating: 5,
    text: "Absolutely stunning suite! We booked this for the bride's final make-up and transit before heading to the kalyanmandap. Extremely premium Odia hospitality.",
    date: "24 May 2026",
    likes: 12
  },
  {
    id: "r2",
    listingId: 1,
    author: "Pratyasha Das",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
    rating: 4.5,
    text: "The wooden filigree design references are so tasteful. Standard of hygiene is impeccable. High speed internet made coordinating live streams seamless.",
    date: "18 May 2026",
    likes: 8
  },
  {
    id: "r3",
    listingId: 8,
    author: "Subhasish Patnaik",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
    rating: 5,
    text: "Azure Sky Deck is the best venue in Bhubaneswar for sunset parties and reception. The panoramic views of the city was breathtaking. Catering was superb!",
    date: "25 May 2026",
    likes: 24
  },
  {
    id: "r4",
    listingId: 2,
    author: "Manoj Harichandan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
    rating: 4,
    text: "Booked a 3-hour micro-stay after taking sacred dip in Puri beach. Very safe place, temple darshan coordination helper was a massive bonus.",
    date: "15 May 2026",
    likes: 5
  },
  {
    id: "r5",
    listingId: 10,
    author: "Ananya Tripathy",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
    rating: 5,
    text: "Attended a relative's wedding here. Felt like entering a royal palace. Seamless airconditioning and huge dining hall which served 800+ people at once.",
    date: "22 May 2026",
    likes: 19
  }
];
