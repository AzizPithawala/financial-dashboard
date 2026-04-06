// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Sidebar (Linear-inspired dark sidebar)
// ═══════════════════════════════════════════════════════════════════

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, TrendingUp, Settings, ChevronLeft, Zap, CalendarDays } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/insights', icon: TrendingUp, label: 'Insights' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const collapsed = useFinanceStore(s => s.sidebarCollapsed);
  const toggle = useFinanceStore(s => s.toggleSidebar);

  return (
    <aside
      style={{
        width: collapsed ? 68 : 240,
        minHeight: '100vh',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 200ms ease',
        position: 'relative',
        zIndex: 40,
      }}
    >
      {/* Brand */}
      <div style={{
        padding: collapsed ? '20px 12px' : '20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Zap size={18} color="#fff" />
        </div>
        {!collapsed && (
          <span style={{
            color: '#f1f5f9', fontWeight: 700, fontSize: 18,
            letterSpacing: '-0.02em',
          }}>
            FINOVA
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: collapsed ? '10px 14px' : '10px 14px',
              borderRadius: 8,
              color: isActive ? '#f1f5f9' : '#94a3b8',
              background: isActive ? '#1e293b' : 'transparent',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              position: 'relative',
              transition: 'all 150ms ease',
            })}
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('active')) {
                e.currentTarget.style.background = '#1e293b';
              }
            }}
            onMouseLeave={(e) => {
              const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: 20, borderRadius: 2,
                    background: '#6366f1',
                  }} />
                )}
                <item.icon size={20} strokeWidth={1.5} />
                {!collapsed && <span>{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={toggle}
        style={{
          margin: 12, padding: 8, borderRadius: 8,
          background: 'transparent', border: 'none',
          color: '#64748b', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        aria-label="Toggle sidebar"
      >
        <ChevronLeft
          size={20}
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms ease',
          }}
        />
      </button>
    </aside>
  );
}
