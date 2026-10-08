import * as Icons from 'lucide-react';
import { Lock } from 'lucide-react';
import { Card } from '../kokonut/Card';
import { useFetch } from '../../hooks/useFetch';
import badgeService from '../../services/badgeService';
import { cn } from '../../utils/cn';

export default function ExplorerBadges() {
  const { data, loading } = useFetch(() => badgeService.getMine(), []);
  const badges = data?.items || [];

  if (loading || badges.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-h4 mb-4">Explorer Badges</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {badges.map((badge) => {
          const Icon = Icons[badge.icon] || Icons.Award;
          return (
            <Card
              key={badge.id}
              className={cn('flex flex-col items-center gap-2 text-center', !badge.earned && 'opacity-50 grayscale')}
            >
              <span
                className={cn(
                  'relative flex h-12 w-12 items-center justify-center rounded-full',
                  badge.earned ? 'bg-gold-100 text-gold-700' : 'bg-charcoal-100 text-charcoal-400'
                )}
              >
                <Icon className="h-6 w-6" />
                {!badge.earned && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal-500 text-white">
                    <Lock className="h-3 w-3" />
                  </span>
                )}
              </span>
              <p className="text-sm font-semibold text-charcoal-800">{badge.label}</p>
              <p className="text-caption">{badge.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
