// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Layout Shell
// ═══════════════════════════════════════════════════════════════════

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

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
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>
      <AmbientBackground />
      <Sidebar />
      <main style={{
        flex: 1,
        background: 'transparent',
        overflow: 'auto',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
      }}>
        <Outlet />
      </main>
    </div>
  );
}
