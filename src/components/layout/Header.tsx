// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Header Component
// ═══════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { Sun, Moon, Plus, Shield, Eye, Scan, Menu } from 'lucide-react';
import { useTheme, useAddTransaction, useIsMobile } from '../../hooks';
import { useFinanceStore } from '../../store/financeStore';
import { ReceiptScannerModal } from '../../features/transactions/ReceiptScannerModal';
import toast from 'react-hot-toast';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onAddTransaction?: () => void;
}

export function Header({ title, subtitle, onAddTransaction }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const userRole = useFinanceStore(s => s.userRole);
  const setUserRole = useFinanceStore(s => s.setUserRole);
  const toggleSidebar = useFinanceStore(s => s.toggleSidebar);
  const [scanOpen, setScanOpen] = useState(false);
  const addMutation = useAddTransaction();
  const isMobile = useIsMobile();

  return (
    <header style={{
      padding: isMobile ? '16px' : '20px 32px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-color)',
      background: 'var(--bg-primary)',
      gap: isMobile ? 16 : 0,
      position: 'sticky',
      top: 0,
      zIndex: 30,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: isMobile ? '100%' : 'auto' }}>
        {isMobile && (
          <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', display: 'flex', padding: 4 }}>
            <Menu size={24} />
          </button>
        )}
        <div>
          <h1 style={{
            fontSize: isMobile ? 22 : 24, fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
        {/* Role Switcher */}
        <div style={{
          display: 'flex', background: 'var(--bg-card)', borderRadius: 10,
          border: '1px solid var(--border-color)', padding: 2, gap: 2,
        }}>
          {(['admin', 'viewer'] as const).map(role => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 10px', borderRadius: 8,
                background: userRole === role ? 'var(--bg-hover)' : 'transparent',
                color: userRole === role ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                transition: 'all 150ms', textTransform: 'capitalize',
              }}
            >
              {role === 'admin' ? <Shield size={14} /> : <Eye size={14} />}
              {role}
            </button>
          ))}
        </div>

        {/* Scan Receipt */}
        {userRole === 'admin' && (
          <button
            onClick={() => setScanOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 14px', borderRadius: 10,
              background: 'var(--bg-card)', color: 'var(--text-primary)',
              border: '1px solid var(--border-color)', fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'all 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <Scan size={16} strokeWidth={1.5} />
            Scan
          </button>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          style={{
            width: 38, height: 38, borderRadius: 10,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
        </button>

        {/* Add Transaction */}
        {userRole === 'admin' && onAddTransaction && (
          <button
            onClick={onAddTransaction}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10,
              background: 'var(--accent)', color: '#fff',
              border: 'none', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Plus size={16} strokeWidth={2} />
            Add
          </button>
        )}
      </div>

      <ReceiptScannerModal
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onComplete={(data) => {
          setScanOpen(false);
          addMutation.mutate({
            ...data,
            date: new Date().toISOString().split('T')[0] // Use today's date
          });
          toast.success('Transaction added from receipt');
        }}
      />
    </header>
  );
}
