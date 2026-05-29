// app/loading.jsx — Next.js loading UI (shown during route transitions)
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-obsidian flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo spinner */}
        <div className="relative w-24 h-24">
          <div
            className="absolute inset-0 rounded-full border border-gold/30"
            style={{ animation: 'spin 3s linear infinite' }}
          />
          <div
            className="absolute inset-3 rounded-full border border-gold/20"
            style={{ animation: 'spin 2s linear infinite reverse' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rotate-45"
              style={{
                background: 'linear-gradient(135deg, #8B6914, #C9A84C, #E8CC7A)',
                animation: 'pulseGlow 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-display text-[18px] tracking-[4px]"
            style={{
              background: 'linear-gradient(90deg, #8B6914, #E8CC7A, #C9A84C, #8B6914)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 2s linear infinite',
            }}
          >
            S.S. JEWELLERS
          </span>
          <span className="font-sans text-[9px] tracking-[3px] uppercase text-fog">Loading...</span>
        </div>
      </div>
    </div>
  );
}
