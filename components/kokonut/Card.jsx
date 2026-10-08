import { cn } from '../../utils/cn';

export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function CardDark({ className, children, ...props }) {
  return (
    <div className={cn('card-dark p-6', className)} {...props}>
      {children}
    </div>
  );
}
