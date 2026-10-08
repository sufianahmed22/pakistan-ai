import { motion } from 'framer-motion';
import EntityImage from '../ui/EntityImage';
import EntityGallery from '../ui/EntityGallery';
import { PLACEHOLDER_IDS } from '../../utils/placeholderImage';

export default function TimelineItem({ year, title, description, image, gallery, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
      className="relative pl-10 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-10 items-start"
    >
      <div className={`hidden sm:block ${align === 'left' ? 'text-right pr-10' : 'order-2 pl-10'}`}>
        {align === 'left' && <TimelineContent year={year} title={title} description={description} image={image} gallery={gallery} align={align} />}
      </div>
      <div className={`${align === 'left' ? 'sm:order-2' : ''} sm:pl-10`}>
        <div className="sm:hidden">
          <TimelineContent year={year} title={title} description={description} image={image} gallery={gallery} align={align} />
        </div>
        {align !== 'left' && <div className="hidden sm:block"><TimelineContent year={year} title={title} description={description} image={image} gallery={gallery} align={align} /></div>}
      </div>
      <span className="absolute left-2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-gold-500 ring-4 ring-gold-100 sm:left-1/2" />
    </motion.div>
  );
}

function TimelineContent({ year, title, description, image, gallery, align }) {
  const alignClass = align === 'left' ? 'sm:ml-auto' : '';
  return (
    <div className="pb-8">
      {image && (
        <div className={`mb-3 h-32 w-full max-w-xs overflow-hidden rounded-xl ${alignClass}`}>
          <EntityImage sources={[image]} fallbackSeed={PLACEHOLDER_IDS.history} alt={title} width={400} height={250} className="h-full w-full object-cover" />
        </div>
      )}
      <p className="text-eyebrow !text-gold-400">{year}</p>
      <h4 className="text-h4 !text-lg mt-1 text-white">{title}</h4>
      <p className="mt-1.5 text-white/60 leading-relaxed">{description}</p>
      {gallery?.length > 0 && (
        <div className={`mt-3 max-w-xs ${alignClass}`}>
          <EntityGallery images={gallery} alt={title} placeholderSeed={PLACEHOLDER_IDS.history} />
        </div>
      )}
    </div>
  );
}
