// FINOVA v3.1 — Budget Features
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Check, Trash2, AlertCircle } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { CATEGORIES, CATEGORY_COLORS } from '../../types';
import type { Category, BudgetProgress } from '../../types';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export function useBudgetProgress(): BudgetProgress[] {
  const transactions = useFinanceStore(s => s.transactions);
  const budgets = useFinanceStore(s => s.budgets);

  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expenses = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    return budgets.map(b => {
      const spent = expenses.filter(t => t.category === b.category).reduce((s, t) => s + t.amount, 0);
      const percentage = Math.min(100, Math.round((spent / b.limit) * 100));
      const remaining = b.limit - spent;
      let status: 'safe' | 'warning' | 'exceeded' = 'safe';
      if (percentage >= 100) status = 'exceeded';
      else if (percentage >= 80) status = 'warning';

      return {
        category: b.category,
        limit: b.limit,
        spent,
        percentage,
        remaining,
        status,
        color: CATEGORY_COLORS[b.category]
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [transactions, budgets]);
}

export function BudgetProgressBar({ progress }: { progress: BudgetProgress }) {
  const statusColor = progress.status === 'safe' ? progress.color : progress.status === 'warning' ? '#F59E0B' : '#DC2626';
  
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: progress.color }} />
          {progress.category}
        </div>
        <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
          <span style={{ color: progress.status === 'exceeded' ? statusColor : 'inherit' }}>
            ₹{progress.spent.toLocaleString('en-IN')}
          </span>
          <span style={{ color: 'var(--text-muted)' }}> / ₹{progress.limit.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: 'var(--border-color)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress.percentage)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: statusColor, borderRadius: 3 }}
        />
      </div>
      {progress.status !== 'safe' && (
        <div style={{ marginTop: 6, fontSize: 11, color: statusColor, display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} />
          {progress.status === 'exceeded' ? 'Budget exceeded' : 'Approaching limit'}
        </div>
      )}
    </div>
  );
}

export function BudgetCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const budgets = useBudgetProgress();

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }} style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={18} style={{ color: 'var(--accent)' }} />
          Monthly Budgets
        </h3>
        <button onClick={() => setModalOpen(true)} style={{
          background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
        }}>
          <Plus size={14} /> Manage
        </button>
      </div>

      {budgets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 14 }}>
          No budgets set yet. Set limits to keep spending in check.
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {budgets.map(b => (
            <BudgetProgressBar key={b.category} progress={b} />
          ))}
        </div>
      )}

      <SetBudgetModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}

export function SetBudgetModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState<Category>('food');
  const [limit, setLimit] = useState('');
  const setBudget = useFinanceStore(s => s.setBudget);
  const removeBudget = useFinanceStore(s => s.removeBudget);
  const budgets = useFinanceStore(s => s.budgets);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || isNaN(Number(limit))) return;
    setBudget(category, Number(limit));
    toast.success('Budget updated');
    setLimit('');
  };

  const handleRemove = (cat: Category) => {
    removeBudget(cat);
    toast.success('Budget removed');
  };

  return (
    <Modal open={open} onClose={onClose} title="Manage Budgets">
      <div style={{ padding: 24 }}>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as Category)} className="input" style={{ width: '100%' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6 }}>Limit (₹)</label>
            <input type="number" value={limit} onChange={e => setLimit(e.target.value)} className="input" style={{ width: '100%' }} placeholder="e.g. 15000" required min={1} />
          </div>
          <button type="submit" className="button" style={{ height: 42, padding: '0 16px' }}>
            <Check size={16} /> Save
          </button>
        </form>

        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Budgets</h4>
        {budgets.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No active budgets.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {budgets.map(b => (
              <div key={b.category} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', background: 'var(--bg-hover)', borderRadius: 8, fontSize: 14
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, textTransform: 'capitalize', fontWeight: 500 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[b.category] }} />
                  {b.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>₹{b.limit.toLocaleString('en-IN')}</span>
                  <button type="button" onClick={() => handleRemove(b.category)} style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4
                  }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
