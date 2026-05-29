// ============================================================
// components/ui/WhatsAppFloat.jsx
// ============================================================
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-7 right-7 z-40 flex flex-col items-end gap-2"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {tooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="bg-charcoal border border-gold/20 text-cream font-sans text-[11px] px-4 py-2.5 whitespace-nowrap shadow-dark"
              >
                Chat with us on WhatsApp 💬
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href="https://wa.me/914023456789?text=Hello%20S.S.%20Jewellers!%20I%20would%20like%20to%20know%20more%20about%20your%20jewellery%20collection."
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            onMouseEnter={() => setTooltip(true)}
            onMouseLeave={() => setTooltip(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-[26px] shadow-lg"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 8px 30px rgba(37,211,102,0.4)' }}
          >
            💬
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WhatsAppFloat;


// ============================================================
// components/ui/ScrollTop.jsx — separate file usage
// ============================================================
// 'use client';
// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ArrowUp } from 'lucide-react';
//
// export default function ScrollTop() {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setVisible(window.scrollY > 400);
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);
//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.button
//           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//           className="fixed bottom-7 left-7 z-40 w-11 h-11 border border-gold/30 bg-charcoal/80 backdrop-blur text-gold flex items-center justify-center hover:bg-gold/15 hover:border-gold transition-all"
//           aria-label="Scroll to top"
//         >
//           <ArrowUp size={16} />
//         </motion.button>
//       )}
//     </AnimatePresence>
//   );
// }
