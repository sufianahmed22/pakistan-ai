import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', dark = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`mb-10 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow && <p className="text-eyebrow mb-3">{eyebrow}</p>}
      <h2 className={`text-h2 ${dark ? 'text-white' : 'text-charcoal-900'}`}>{title}</h2>
      {subtitle && <p className={`text-body-lg mt-3 ${dark ? 'text-white/70' : ''}`}>{subtitle}</p>}
    </motion.div>
  );
}
