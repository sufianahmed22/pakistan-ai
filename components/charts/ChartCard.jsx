import { Card } from '../kokonut/Card';

// Shared frame every chart renders inside: title, optional caption/source line, and
// a fixed-height responsive container.
export default function ChartCard({ title, caption, height = 320, children, className = '' }) {
  return (
    <Card className={className}>
      {title && <h3 className="text-h4 mb-1">{title}</h3>}
      {caption && <p className="text-caption mb-4">{caption}</p>}
      <div style={{ width: '100%', height }}>{children}</div>
    </Card>
  );
}
