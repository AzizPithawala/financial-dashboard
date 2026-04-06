// FINOVA v3.0 — Settings Page
import { Header } from '../components/layout/Header';
import { useFinanceStore } from '../store/financeStore';
import { useTheme } from '../hooks';
import { Monitor, Moon, Sun, Rows3, Rows4, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const densityMode = useFinanceStore(s => s.densityMode);
  const setDensityMode = useFinanceStore(s => s.setDensityMode);
  const txCount = useFinanceStore(s => s.transactions.length);

  const clearData = () => {
    if (confirm('Are you sure? This will delete all transactions.')) {
      useFinanceStore.setState({ transactions: [] });
      toast.success('All data cleared');
    }
  };

  const SettingRow = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', borderBottom: '1px solid var(--border-color)',
    }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{desc}</div>
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <Header title="Settings" subtitle="Customize your experience" />
      <div style={{ padding: '24px 32px', maxWidth: 640 }}>
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ padding: '8px 24px' }}>
          <SettingRow label="Theme" desc="Switch between light and dark mode">
            <button onClick={toggleTheme} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
              border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
              color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </SettingRow>

          <SettingRow label="Data Density" desc="Compact rows for power users">
            <div style={{ display: 'flex', gap: 4 }}>
              {(['comfortable', 'compact'] as const).map(m => (
                <button key={m} onClick={() => setDensityMode(m)} style={{
                  padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  border: `1px solid ${densityMode === m ? 'var(--accent)' : 'var(--border-color)'}`,
                  background: densityMode === m ? 'rgba(99,102,241,0.06)' : 'var(--bg-primary)',
                  color: densityMode === m ? 'var(--accent)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {m === 'compact' ? <Rows3 size={14} /> : <Rows4 size={14} />}
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </SettingRow>

          <SettingRow label="Clear All Data" desc={`Delete all ${txCount} transactions`}>
            <button onClick={clearData} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8,
              border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.06)',
              color: '#DC2626', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              <Trash2 size={14} /> Clear Data
            </button>
          </SettingRow>
        </motion.div>

        <div style={{ marginTop: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          FINOVA v3.0 · Elite Engineering Specification · Built with React + TypeScript
        </div>
      </div>
    </div>
  );
}
