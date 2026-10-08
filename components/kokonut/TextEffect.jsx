import { motion } from 'framer-motion';

// Word-by-word reveal for hero/section headlines.
export default function TextEffect({ text, className = '', delay = 0, as: Comp = 'span' }) {
  const words = text.split(' ');
  return (
    <Comp className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.28em]"
          initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + i * 0.05 }}
        >
          {word}
        </motion.span>
      ))}
    </Comp>
  );
}
