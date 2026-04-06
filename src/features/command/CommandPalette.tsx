// FINOVA v3.1 — Command Palette (⌘K)
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, ArrowLeftRight, TrendingUp, Settings,
  Moon, Sun, Download, Rows3, Rows4
} from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useKeyboard, useTheme } from '../../hooks';
import { exportTransactionsCSV } from '../transactions/TransactionFeatures';

interface Command {
  id: string;
  name: string;
  icon: React.ElementType;
  section: 'Navigation' | 'Actions';
  action: () => void;
}

export function CommandPalette() {
  const open = useFinanceStore(s => s.commandPaletteOpen);
  const setOpen = useFinanceStore(s => s.setCommandPaletteOpen);
  const transactions = useFinanceStore(s => s.transactions);
  const densityMode = useFinanceStore(s => s.densityMode);
  const setDensityMode = useFinanceStore(s => s.setDensityMode);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut to open (k)
  useKeyboard('k', () => setOpen(true));
  useKeyboard('Escape', () => setOpen(false));

  const commands: Command[] = [
    { id: 'nav-dashboard', name: 'Go to Dashboard', icon: LayoutDashboard, section: 'Navigation', action: () => navigate('/') },
    { id: 'nav-transactions', name: 'Go to Transactions', icon: ArrowLeftRight, section: 'Navigation', action: () => navigate('/transactions') },
    { id: 'nav-insights', name: 'Go to Insights', icon: TrendingUp, section: 'Navigation', action: () => navigate('/insights') },
    { id: 'nav-settings', name: 'Go to Settings', icon: Settings, section: 'Navigation', action: () => navigate('/settings') },
    
    { id: 'action-theme', name: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Theme`, icon: theme === 'light' ? Moon : Sun, section: 'Actions', action: toggleTheme },
    { id: 'action-density', name: `Switch to ${densityMode === 'comfortable' ? 'Compact' : 'Comfortable'} Density`, icon: densityMode === 'comfortable' ? Rows3 : Rows4, section: 'Actions', action: () => setDensityMode(densityMode === 'comfortable' ? 'compact' : 'comfortable') },
    { id: 'action-export', name: 'Export Transactions as CSV', icon: Download, section: 'Actions', action: () => exportTransactionsCSV(transactions) },
  ];

  // Simple fuzzy search over commands + transaction descriptions
  const filteredCommands = commands.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.section.toLowerCase().includes(query.toLowerCase())
  );
  
  const filteredTransactions = query.trim() !== '' 
    ? transactions.filter(t => t.description.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  const totalResults = filteredCommands.length + filteredTransactions.length;

  // Reset selection when query changes
  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Focus input on open
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); else setQuery(''); }, [open]);

  // Keyboard navigation within palette
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % totalResults);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + totalResults) % totalResults);
      } else if (e.key === 'Enter' && totalResults > 0) {
        e.preventDefault();
        if (selectedIndex < filteredCommands.length) {
          filteredCommands[selectedIndex].action();
          setOpen(false);
        } else {
          // If transaction selected, maybe navigate to it or just close
          navigate('/transactions');
          useFinanceStore.setState(s => ({ filters: { ...s.filters, search: filteredTransactions[selectedIndex - filteredCommands.length].description } }));
          setOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, totalResults, filteredCommands, filteredTransactions, navigate, setOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-selected="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'relative', width: '100%', maxWidth: 640, background: 'var(--bg-card)',
              borderRadius: 16, border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-color)' }}>
              <Search size={20} style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search commands or transactions..."
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none', padding: '0 16px',
                  fontSize: 16, color: 'var(--text-primary)'
                }}
              />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 6px', background: 'var(--bg-hover)', borderRadius: 4 }}>ESC</div>
            </div>

            <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
              {totalResults === 0 ? (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No results found for "{query}"
                </div>
              ) : (
                <>
                  {filteredCommands.length > 0 && (
                    <div style={{ padding: '8px 20px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Commands
                    </div>
                  )}
                  {filteredCommands.map((cmd, i) => {
                    const isSelected = i === selectedIndex;
                    return (
                      <div
                        key={cmd.id}
                        data-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => { cmd.action(); setOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', cursor: 'pointer',
                          background: isSelected ? 'var(--bg-hover)' : 'transparent',
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                      >
                        <div style={{ color: isSelected ? 'var(--accent)' : 'var(--text-muted)' }}><cmd.icon size={18} /></div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{cmd.name}</div>
                      </div>
                    );
                  })}
                  
                  {filteredTransactions.length > 0 && (
                    <div style={{ padding: '16px 20px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Transactions
                    </div>
                  )}
                  {filteredTransactions.map((tx, i) => {
                    const idx = i + filteredCommands.length;
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={tx.id}
                        data-selected={isSelected}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => { 
                          navigate('/transactions');
                          useFinanceStore.setState(s => ({ filters: { ...s.filters, search: tx.description } }));
                          setOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', cursor: 'pointer',
                          background: isSelected ? 'var(--bg-hover)' : 'transparent',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid var(--border-color)', color: 'var(--text-muted)'
                          }}>
                            {tx.type === 'income' ? <TrendingUp size={14} /> : <ArrowLeftRight size={14} />}
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{tx.description}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{tx.category} • {tx.date}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: tx.type === 'income' ? '#059669' : 'var(--text-primary)' }}>
                          {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-color)' }}>↑↓</kbd> to navigate
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <kbd style={{ background: 'var(--bg-hover)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border-color)' }}>↵</kbd> to select
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
