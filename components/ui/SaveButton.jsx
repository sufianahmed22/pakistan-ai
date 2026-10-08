import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import savedService from '../../services/savedService';

export default function SaveButton({
  entityType = 'destination',
  entityId,
  entityName = 'Place',
  variant = 'button', // 'button' | 'icon' | 'badge'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  initialSaved = false,
  onToggle,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (isAuthenticated && entityId) {
      savedService
        .check(entityType, entityId)
        .then((res) => {
          if (mounted && typeof res?.isSaved === 'boolean') {
            setIsSaved(res.isSaved);
          }
        })
        .catch(() => {});
    } else {
      setIsSaved(false);
    }
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, entityType, entityId]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Sign in to save this to your dashboard', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/login', { state: { from: location } }),
        },
      });
      return;
    }

    if (!entityId || loading) return;

    const previousState = isSaved;
    const nextState = !previousState;
    setIsSaved(nextState);
    setLoading(true);

    try {
      const res = await savedService.toggle(entityType, entityId);
      const serverSaved = res?.isSaved ?? nextState;
      setIsSaved(serverSaved);
      if (serverSaved) {
        toast.success(`Saved "${entityName}" to your dashboard`);
      } else {
        toast.success(`Removed "${entityName}" from saved places`);
      }
      onToggle?.(serverSaved);
    } catch (err) {
      setIsSaved(previousState);
      toast.error(err.message || 'Could not update saved place');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isSaved ? `Remove ${entityName} from saved` : `Save ${entityName}`}
        title={isSaved ? 'Saved' : 'Save'}
        className={`group flex items-center justify-center rounded-full p-2 transition-all ${
          isSaved
            ? 'bg-gold-500 text-charcoal-950 shadow-md hover:bg-gold-400'
            : 'bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-gold-300'
        } ${className}`}
      >
        <Bookmark
          className={`${
            size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'
          } ${isSaved ? 'fill-current' : 'group-hover:scale-110'} transition-transform`}
        />
      </button>
    );
  }

  // Default 'button' variant (glass pill or clean button)
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSaved ? `Remove ${entityName} from saved` : `Save ${entityName}`}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
        isSaved
          ? 'bg-gold-500 text-charcoal-950 shadow-soft hover:bg-gold-400'
          : 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30 border border-white/20'
      } ${className}`}
    >
      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
      <span>{isSaved ? 'Saved' : 'Save'}</span>
    </button>
  );
}
