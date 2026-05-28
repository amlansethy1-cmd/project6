/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Mode = 'rooms' | 'party';
export type Tier = 'economy' | 'standard' | 'premium';

export interface Listing {
  id: number;
  title: string;
  location: 'Bhubaneswar' | 'Puri' | 'Cuttack' | 'Sambalpur' | 'Rourkela';
  price: string;
  priceNum: number; // numeric value for backend calculations
  views: number;
  slots: { time: string; status: 'Available' | 'Booked' }[];
  status: string;
  img: string;
  description: string;
  rating: number;
  capacity: string;
  amenities: string[];
  tier: Tier;
  mode: Mode;
  tags?: string[];
  discount?: boolean;
  originalPrice?: string;
}

export interface Booking {
  id: string;
  listingId: number;
  listingTitle: string;
  listingImg: string;
  customerName: string;
  customerPhone: string;
  date: string;
  selectedSlot: string;
  guestsCount: number;
  totalAmount: string;
  timestamp: string;
  status: 'confirmed' | 'cancelled';
  tier: Tier;
  checkedIn?: boolean;
}

export interface Review {
  id: string;
  listingId: number;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  likes: number;
}
