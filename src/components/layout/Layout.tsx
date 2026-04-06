// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Layout Shell
// ═══════════════════════════════════════════════════════════════════

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useFinanceStore } from '../../store/financeStore';
import { useIsMobile } from '../../hooks';

function AmbientBackground() {
  return (
    <div className="ambient-background">
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />
    </div>
  );
}

export function Layout() {
  const isMobile = useIsMobile();
  const collapsed = useFinanceStore(s => s.sidebarCollapsed);
  const toggle = useFinanceStore(s => s.toggleSidebar);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      <AmbientBackground />
      {isMobile && !collapsed && (
        <div className="mobile-overlay" onClick={toggle} />
      )}
      <Sidebar />
      <main style={{
        flex: 1,
        background: 'transparent',
        overflow: 'auto',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        width: isMobile ? '100%' : 'calc(100% - 240px)'
      }}>
        <Outlet />
      </main>
    </div>
  );
}
