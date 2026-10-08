import { motion } from 'framer-motion';

// Soft cinematic gradient + slow-drifting glow blobs used behind dark hero/CTA sections.
export default function AnimatedBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-600/30 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-noise" />
    </div>
  );
}
