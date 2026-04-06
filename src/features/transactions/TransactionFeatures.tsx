// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Transaction Features
// FilterBar, TransactionTable, AddTransactionModal, Pagination, Export
// ═══════════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '../../hooks';
import { CategoryBadge } from '../../components/ui/SharedComponents';
import { Modal } from '../../components/ui/Modal';
import { CATEGORIES, type Category, type TransactionType, type Transaction, type Filters } from '../../types';
import { useFinanceStore } from '../../store/financeStore';

// ── FilterBar ───────────────────────────────────────────────────
interface FilterBarProps {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
  resultCount: number;
  onExport: () => void;
}

export function FilterBar({ filters, onChange, onReset, resultCount, onExport }: FilterBarProps) {
  const activeCount = [
    filters.category !== 'all',
    filters.type !== 'all',
    filters.dateFrom !== '',
    filters.dateTo !== '',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10,
      padding: '16px 0',
    }}>
      {/* Search */}
      <div style={{
        position: 'relative', flex: '1 1 220px', maxWidth: 320,
      }}>
        <Search size={16} style={{
          position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)',
        }} />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={e => onChange({ search: e.target.value, page: 1 })}
          style={{
            width: '100%', padding: '9px 12px 9px 36px',
            borderRadius: 10, border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', color: 'var(--text-primary)',
            fontSize: 14, outline: 'none',
            transition: 'border-color 150ms',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        />
      </div>

      {/* Category */}
      <select
        value={filters.category}
        onChange={e => onChange({ category: e.target.value as Category | 'all', page: 1 })}
        style={{
          padding: '9px 12px', borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          fontSize: 14, cursor: 'pointer', outline: 'none',
        }}
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map(c => (
          <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>
        ))}
      </select>

      {/* Type */}
      <select
        value={filters.type}
        onChange={e => onChange({ type: e.target.value as TransactionType | 'all', page: 1 })}
        style={{
          padding: '9px 12px', borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          fontSize: 14, cursor: 'pointer', outline: 'none',
        }}
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Date From */}
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => onChange({ dateFrom: e.target.value, page: 1 })}
        style={{
          padding: '9px 12px', borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          fontSize: 14, outline: 'none',
        }}
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => onChange({ dateTo: e.target.value, page: 1 })}
        style={{
          padding: '9px 12px', borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          fontSize: 14, outline: 'none',
        }}
      />

      {/* Active filter count + reset */}
      {activeCount > 0 && (
        <button
          onClick={onReset}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '8px 14px', borderRadius: 10,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', color: 'var(--text-secondary)',
            fontSize: 13, cursor: 'pointer',
          }}
        >
          <Filter size={14} />
          Clear ({activeCount})
        </button>
      )}

      {/* Export */}
      <button
        onClick={onExport}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '8px 14px', borderRadius: 10,
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)', color: 'var(--text-secondary)',
          fontSize: 13, cursor: 'pointer', marginLeft: 'auto',
        }}
      >
        <Download size={14} />
        Export CSV
      </button>
    </div>
  );
}

// ── TransactionTable ────────────────────────────────────────────
interface TransactionTableProps {
  data: Transaction[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  densityMode: 'compact' | 'comfortable';
}

export function TransactionTable({ data, isLoading, onDelete, densityMode }: TransactionTableProps) {
  const rowH = densityMode === 'compact' ? 32 : 48;
  const userRole = useFinanceStore(s => s.userRole);

  if (isLoading) {
    return (
      <div className="card" style={{ overflow: 'hidden' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{
            padding: '12px 20px', borderBottom: '1px solid var(--border-color)',
            display: 'flex', gap: 16,
          }}>
            <div className="skeleton" style={{ width: 80, height: 14 }} />
            <div className="skeleton" style={{ flex: 1, height: 14 }} />
            <div className="skeleton" style={{ width: 60, height: 14 }} />
            <div className="skeleton" style={{ width: 80, height: 14 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ minWidth: 600 }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 120px 100px 90px 50px',
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-color)',
        fontSize: 12, fontWeight: 600,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        <span>Date</span>
        <span>Description</span>
        <span>Category</span>
        <span>Type</span>
        <span style={{ textAlign: 'right' }}>Amount</span>
        <span />
      </div>

      {/* Rows */}
      <AnimatePresence mode="popLayout">
        {data.map((txn, i) => (
          <motion.div
            key={txn.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: i * 0.03, duration: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 120px 100px 90px 50px',
              padding: `${rowH === 32 ? 6 : 12}px 20px`,
              borderBottom: '1px solid var(--border-color)',
              fontSize: 14,
              color: 'var(--text-primary)',
              alignItems: 'center',
              cursor: 'default',
              transition: 'background 100ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span className="font-mono-num" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
            </span>
            <span style={{
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {txn.description}
            </span>
            <span><CategoryBadge category={txn.category} /></span>
            <span style={{
              fontSize: 12, fontWeight: 500,
              color: txn.type === 'income' ? '#059669' : '#DC2626',
              textTransform: 'capitalize',
            }}>
              {txn.type}
            </span>
            <span className="font-mono-num" style={{
              textAlign: 'right', fontWeight: 500,
              color: txn.type === 'income' ? '#059669' : '#DC2626',
            }}>
              {txn.type === 'income' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
            </span>
            {userRole === 'admin' ? (
              <button
                onClick={() => onDelete(txn.id)}
                style={{
                  width: 28, height: 28, borderRadius: 6,
                  border: 'none', background: 'transparent',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(220,38,38,0.08)';
                  e.currentTarget.style.color = '#DC2626';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                <Trash2 size={14} />
              </button>
            ) : <span />}
          </motion.div>
        ))}
      </AnimatePresence>
      </div>
    </div>
  );
}

// ── Pagination ──────────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function Pagination({ page, totalPages, total, onPrev, onNext, isFirst, isLast }: PaginationProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 0', fontSize: 13, color: 'var(--text-secondary)',
    }}>
      <span>{total} transaction{total !== 1 ? 's' : ''}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={onPrev} disabled={isFirst}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', cursor: isFirst ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: isFirst ? 0.4 : 1, color: 'var(--text-primary)',
          }}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-mono-num" style={{ fontSize: 13 }}>
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext} disabled={isLast}
          style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)', cursor: isLast ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: isLast ? 0.4 : 1, color: 'var(--text-primary)',
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ── AddTransactionModal ─────────────────────────────────────────
interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

export function AddTransactionModal({ open, onClose, onSubmit, isLoading }: AddTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!description.trim()) errs.description = 'Description is required';
    if (!date) errs.date = 'Date is required';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    onSubmit({ amount: Number(amount), category, type, description: description.trim(), date });
    // Reset
    setAmount(''); setDescription(''); setErrors({});
    setDate(new Date().toISOString().split('T')[0]);
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${errors[field] ? '#DC2626' : 'var(--border-color)'}`,
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    fontSize: 14, outline: 'none',
    transition: 'border-color 150ms',
  });

  return (
    <Modal open={open} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Amount */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Amount
          </label>
          <input
            type="number" value={amount} onChange={e => { setAmount(e.target.value); setErrors(er => ({ ...er, amount: '' })); }}
            placeholder="₹ 0" style={inputStyle('amount')} min="0" step="0.01"
          />
          {errors.amount && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.amount}</span>}
        </div>

        {/* Type */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Type
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['income', 'expense'] as const).map(t => (
              <button key={t} type="button" onClick={() => setType(t)}
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: `2px solid ${type === t ? (t === 'income' ? '#059669' : '#DC2626') : 'var(--border-color)'}`,
                  background: type === t ? (t === 'income' ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)') : 'var(--bg-primary)',
                  color: type === t ? (t === 'income' ? '#059669' : '#DC2626') : 'var(--text-secondary)',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  textTransform: 'capitalize', transition: 'all 150ms',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Category
          </label>
          <select value={category} onChange={e => setCategory(e.target.value as Category)}
            style={{ ...inputStyle('category'), cursor: 'pointer' }}>
            {CATEGORIES.map(c => (
              <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Description
          </label>
          <input
            type="text" value={description} onChange={e => { setDescription(e.target.value); setErrors(er => ({ ...er, description: '' })); }}
            placeholder="What was this for?" style={inputStyle('description')}
          />
          {errors.description && <span style={{ fontSize: 12, color: '#DC2626', marginTop: 4, display: 'block' }}>{errors.description}</span>}
        </div>

        {/* Date */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Date
          </label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle('date')} />
        </div>

        {/* Submit */}
        <button
          type="submit" disabled={isLoading}
          style={{
            marginTop: 8, padding: '12px 20px', borderRadius: 10,
            background: 'var(--accent)', color: '#fff', border: 'none',
            fontSize: 14, fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1, transition: 'all 150ms',
          }}
        >
          {isLoading ? 'Saving...' : 'Save Transaction'}
        </button>
      </form>
    </Modal>
  );
}

// ── CSV Export Utility ──────────────────────────────────────────
export function exportTransactionsCSV(transactions: Transaction[]) {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [t.date, t.description, t.category, t.type, String(t.amount)]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `finova-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
