// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Empty State + Badge + Spinner Components
// ═══════════════════════════════════════════════════════════════════

import type { Category } from '../../types';
import { CATEGORY_COLORS } from '../../types';
import { Wallet, Plus } from 'lucide-react';

// ── EmptyState ──────────────────────────────────────────────────
interface EmptyStateProps {
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({
  title = 'No transactions yet',
  description = 'Start tracking your finances by adding your first transaction',
  onAction,
  actionLabel = 'Add your first transaction',
}: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 20px', textAlign: 'center',
    }}>
      <div className="empty-float" style={{
        width: 80, height: 80, borderRadius: 20,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
      }}>
        <Wallet size={36} strokeWidth={1.5} style={{ color: 'var(--accent)' }} />
      </div>
      <h3 style={{
        fontSize: 18, fontWeight: 600, color: 'var(--text-primary)',
        marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: 14, color: 'var(--text-secondary)',
        maxWidth: 320, lineHeight: 1.6, marginBottom: 24,
      }}>
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 10,
            background: 'var(--accent)', color: '#fff',
            border: 'none', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', transition: 'all 150ms',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
        >
          <Plus size={16} strokeWidth={2} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// ── Badge ────────────────────────────────────────────────────────
interface BadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: BadgeProps) {
  const color = CATEGORY_COLORS[category];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 10px', borderRadius: 100,
      fontSize: 12, fontWeight: 500,
      background: `${color}18`,
      color: color,
      textTransform: 'capitalize',
    }}>
      {category}
    </span>
  );
}

// ── Spinner ──────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="var(--border-color)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────
export function Skeleton({ width = '100%', height = 20 }: { width?: string | number; height?: number }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: 8 }} />
  );
}
