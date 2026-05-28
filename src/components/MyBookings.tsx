/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TicketCheck, Trash2, Calendar, MapPin, QrCode, ClipboardList, RefreshCw, Compass } from 'lucide-react';
import { Booking } from '../types';

interface MyBookingsProps {
  bookings: Booking[];
  theme: any;
  onCancel: (id: string) => void;
}

export default function MyBookings({ bookings, theme, onCancel }: MyBookingsProps) {
  const [activeDirections, setActiveDirections] = useState<string | null>(null);

  const simulateDirections = (bookingId: string) => {
    if (activeDirections === bookingId) {
      setActiveDirections(null);
    } else {
      setActiveDirections(bookingId);
    }
  };

  return (
    <div className="w-full h-full font-sans pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-serif font-black tracking-tight" style={{ color: theme.textPrimary }}>
            My Wallet Pass
          </h2>
          <p className="text-[11px]" style={{ color: theme.textMuted }}>
            {bookings.length} active reservations logged offline
          </p>
        </div>
        <ClipboardList size={22} style={{ color: theme.accent }} />
      </div>

      <AnimatePresence mode="wait">
        {bookings.length === 0 ? (
          <motion.div
            key="empty-wallet"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col items-center justify-center py-20 text-center px-4"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-400/5 dark:bg-zinc-800/10 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-200/50 dark:border-zinc-800">
              <Compass size={28} />
            </div>
            <h3 className="text-sm font-bold font-serif" style={{ color: theme.textPrimary }}>
              No Active Gate Passes Found
            </h3>
            <p className="text-xs max-w-xs mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
              Your confirmed Odisha Kalyanmandap or Suite bookings will materialize here for check-in scans.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="bookings-list"
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {bookings.map((booking, idx) => {
              const showsDirections = activeDirections === booking.id;
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.90 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="rounded-3xl border shadow-md relative overflow-hidden"
                  style={{ backgroundColor: theme.card, borderColor: `${theme.textMuted}1a` }}
                >
                  {/* Outer ticket tabs layout */}
                  <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#faf8f5] dark:bg-[#0a0a0a]" style={{ borderRight: `1px solid ${theme.textMuted}22` }} />
                  <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#faf8f5] dark:bg-[#0a0a0a]" style={{ borderLeft: `1px solid ${theme.textMuted}22` }} />

                  {/* Header metadata */}
                  <div 
                    className="p-4 border-b border-dashed flex justify-between items-center"
                    style={{ borderColor: `${theme.textMuted}22` }}
                  >
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold" style={{ color: theme.textMuted }}>
                        Booking ID
                      </span>
                      <p className="text-xs font-mono font-black" style={{ color: theme.textPrimary }}>
                        {booking.id}
                      </p>
                    </div>
                    <button 
                      onClick={() => onCancel(booking.id)}
                      className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer"
                      title="Cancel Booking"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Body Info block */}
                  <div className="p-4 space-y-3.5">
                    <div className="flex gap-3">
                      <img 
                        src={booking.listingImg} 
                        alt={booking.listingTitle} 
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col justify-center">
                        <span className="text-[8px] font-mono tracking-wider font-bold" style={{ color: theme.accent }}>
                          ODISHA VENUE
                        </span>
                        <h4 className="text-sm font-serif font-black leading-tight" style={{ color: theme.textPrimary }}>
                          {booking.listingTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 font-mono text-[11px]">
                      <div>
                        <span className="text-[8px] block uppercase font-bold" style={{ color: theme.textMuted }}>DATE</span>
                        <span className="font-bold" style={{ color: theme.textPrimary }}>{booking.date}</span>
                      </div>
                      <div>
                        <span className="text-[8px] block uppercase font-bold" style={{ color: theme.textMuted }}>SLOT HOUR</span>
                        <span className="font-bold" style={{ color: theme.textPrimary }}>{booking.selectedSlot}</span>
                      </div>
                      <div>
                        <span className="text-[8px] block uppercase font-bold" style={{ color: theme.textMuted }}>HOLDER</span>
                        <span className="font-bold" style={{ color: theme.textPrimary }}>{booking.customerName}</span>
                      </div>
                      <div>
                        <span className="text-[8px] block uppercase font-bold" style={{ color: theme.textMuted }}>EXPECTED</span>
                        <span className="font-bold" style={{ color: theme.textPrimary }}>{booking.guestsCount} Heads</span>
                      </div>
                    </div>

                    {/* Simulation maps button */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => simulateDirections(booking.id)}
                        className="flex-1 text-center py-2 border rounded-xl font-mono text-[10px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-transform"
                        style={{ 
                          borderColor: `${theme.accent}33`, 
                          color: theme.accent,
                          backgroundColor: `${theme.accent}0d`
                        }}
                      >
                        {showsDirections ? "Close Guide" : "Get Gateway Route"}
                      </button>
                    </div>

                    {/* Directions simulator view */}
                    <AnimatePresence>
                      {showsDirections && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed rounded-xl space-y-2 text-[10px] font-mono"
                          style={{ borderColor: `${theme.textMuted}33` }}
                        >
                          <div className="flex gap-2 items-center text-teal-500 font-bold">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                            GPS Gate Link: ACTIVE
                          </div>
                          <div className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
                            <p>🗺️ 1. Start from Main Odisha National Highway 16.</p>
                            <p>🛣️ 2. Drive 4.2 KM towards central city hub junction.</p>
                            <p>🏡 3. Entry gate is instantly recognizable with the glowing gold "Verified OK." banner poles.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Barcode Receipt section */}
                    <div className="pt-3 border-t flex justify-between items-center" style={{ borderColor: `${theme.textMuted}1a` }}>
                      <div>
                        <span className="text-[8px] font-mono block uppercase font-bold" style={{ color: theme.textMuted }}>TOTAL BILL PAID</span>
                        <span className="font-black text-sm font-serif" style={{ color: theme.textPrimary }}>{booking.totalAmount}</span>
                      </div>
                      <div className="p-0.5 bg-white border border-gray-100 rounded-md">
                        <QrCode size={34} strokeWidth={1} className="text-black" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
