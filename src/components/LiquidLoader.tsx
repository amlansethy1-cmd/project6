import React from 'react';

interface LiquidLoaderProps {
  height: number;
  theme: any;
  isRefreshing: boolean;
  activeMode: 'rooms' | 'party';
}

export default function LiquidLoader({ height, theme, isRefreshing, activeMode }: LiquidLoaderProps) {
  const visible = height > 5 || isRefreshing;
  if (!visible) return null;

  const opacity = height > 20 ? 1 : height / 20;
  const containerHeight = Math.min(height + 20, 90);

  const ROOMS_BARS = [
    { color: '#C5A059', delay: 0 },
    { color: '#D4B87A', delay: 0.12 },
    { color: '#E8C870', delay: 0.24 },
    { color: '#D4B87A', delay: 0.36 },
    { color: '#C5A059', delay: 0.48 },
  ];

  const PARTY_DOTS = [
    { color: '#F59E0B', delay: 0 },
    { color: '#FCD34D', delay: 0.14 },
    { color: '#F59E0B', delay: 0.28 },
  ];

  return (
    <>
      <style>{`
        @keyframes okBarPulse {
          0%, 100% { height: 6px; }
          50% { height: 28px; }
        }
        @keyframes okDotBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: containerHeight,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 12,
        opacity,
        transition: 'opacity 0.15s ease',
        zIndex: 50,
        pointerEvents: 'none',
      }}>

        {activeMode === 'rooms' ? (
          <>
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 32 }}>
              {ROOMS_BARS.map((bar, i) => (
                <div key={i} style={{
                  width: 5,
                  minHeight: 6,
                  background: bar.color,
                  borderRadius: 3,
                  alignSelf: 'flex-end',
                  animation: `okBarPulse 0.85s ease-in-out ${bar.delay}s infinite`,
                }} />
              ))}
            </div>
            <p style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: '#9A8E7E',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginTop: 8,
              opacity: isRefreshing ? 1 : 0,
              transition: 'opacity 0.3s ease 0.3s',
            }}>
              Loading Suites
            </p>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {PARTY_DOTS.map((dot, i) => (
                <div key={i} style={{
                  width: 11,
                  height: 11,
                  borderRadius: '50%',
                  background: dot.color,
                  animation: `okDotBounce 0.72s ease-in-out ${dot.delay}s infinite`,
                }} />
              ))}
            </div>
            <p style={{
              fontSize: 9,
              fontFamily: 'monospace',
              color: '#8A7840',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginTop: 8,
              opacity: isRefreshing ? 1 : 0,
              transition: 'opacity 0.3s ease 0.3s',
            }}>
              Loading Mandaps
            </p>
          </>
        )}

      </div>
    </>
  );
}
