'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { useImageZoom } from '@/lib/hooks';

/**
 * ProductGallery — full-featured image gallery
 * Props:
 *   images    [{ url, publicId, isMain }]  — product images
 *   icon      string                        — fallback emoji
 *   name      string                        — alt text
 */
export default function ProductGallery({ images = [], icon = '💍', name = '' }) {
  const [activeIdx, setActiveIdx]     = useState(0);
  const [lightboxOpen, setLightbox]   = useState(false);
  const { ref: zoomRef, style: zoomStyle, handleMouseMove, handleMouseLeave } = useImageZoom();

  const hasImages = images.length > 0 && images[0]?.url;
  const activeImg = hasImages ? images[activeIdx] : null;

  const prev = useCallback(() => setActiveIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIdx((i) => (i + 1) % images.length), [images.length]);

  // Keyboard navigation inside lightbox
  const handleKeyDown = useCallback((e) => {
    if (!lightboxOpen) return;
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape')     setLightbox(false);
  }, [lightboxOpen, prev, next]);

  return (
    <>
      {/* ── Main image ────────────────────────────────── */}
      <div className="space-y-3" onKeyDown={handleKeyDown} tabIndex={0}>
        <div
          ref={zoomRef}
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#1a1500] via-[#2d2200] to-[#0d0900] border border-gold/10 group cursor-zoom-in"
          onMouseMove={hasImages ? handleMouseMove : undefined}
          onMouseLeave={hasImages ? handleMouseLeave : undefined}
          onClick={() => setLightbox(true)}
        >
          {hasImages ? (
            <motion.img
              key={activeImg.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              src={activeImg.url}
              alt={name}
              style={zoomStyle}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute w-48 h-48 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
                  style={{ background: 'conic-gradient(from 0deg, transparent, rgba(201,168,76,0.3), transparent)', animation: 'spin 8s linear infinite' }}
                />
                <span className="text-[120px] relative z-10 filter drop-shadow-[0_0_40px_rgba(201,168,76,0.6)]">
                  {icon}
                </span>
              </div>
            </div>
          )}

          {/* Zoom hint */}
          <div className="absolute bottom-4 right-4 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn size={16} className="text-gold" />
          </div>

          {/* Navigation arrows (only with multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-gold/25 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border border-gold/25 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 font-sans text-[10px] text-fog">
              {activeIdx + 1} / {images.length}
            </div>
          )}
        </div>

        {/* ── Thumbnails ────────────────────────────────── */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.publicId || i}
                onClick={() => setActiveIdx(i)}
                className={`flex-shrink-0 w-[72px] h-[72px] overflow-hidden border-2 transition-all bg-gradient-to-br from-[#1a1500] to-[#2d2200] ${
                  i === activeIdx
                    ? 'border-gold shadow-gold'
                    : 'border-gold/15 hover:border-gold/40'
                }`}
              >
                {img.url ? (
                  <img src={img.url} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">{icon}</div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Share & zoom strip ─────────────────────────── */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setLightbox(true)}
            className="flex items-center gap-1.5 font-sans text-[10px] tracking-[1px] uppercase text-fog hover:text-gold transition-colors"
          >
            <ZoomIn size={13} /> Full View
          </button>
        </div>
      </div>

      {/* ── Lightbox ──────────────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 w-10 h-10 border border-gold/25 flex items-center justify-center text-fog hover:text-gold hover:border-gold transition-all"
            >
              <X size={18} />
            </button>

            {/* Counter */}
            {images.length > 1 && (
              <div className="absolute top-5 left-5 font-sans text-[11px] text-fog">
                {activeIdx + 1} / {images.length}
              </div>
            )}

            {/* Image */}
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl max-h-[85vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {activeImg?.url ? (
                <img
                  src={activeImg.url}
                  alt={name}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <span className="text-[180px] filter drop-shadow-[0_0_60px_rgba(201,168,76,0.6)]">{icon}</span>
              )}
            </motion.div>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-gold/25 bg-black/60 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 border border-gold/25 bg-black/60 flex items-center justify-center text-cream hover:text-gold hover:border-gold transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveIdx(i); }}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeIdx ? 'bg-gold w-5' : 'bg-fog/40 hover:bg-fog'}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
