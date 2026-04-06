import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { Modal } from '../../components/ui/Modal';
import toast from 'react-hot-toast';

export function AddGoalModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [icon, setIcon] = useState('🎯');
  const addGoal = useFinanceStore(s => s.addGoal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(Number(target)) || Number(target) <= 0) return;
    if (addGoal) {
      addGoal({ name: name.trim(), target: Number(target), icon });
      toast.success('Savings goal added!');
      setName(''); setTarget(''); setIcon('🎯');
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Savings Goal">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Goal Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Macbook Pro" required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Target Amount (₹)</label>
          <input type="number" value={target} onChange={e => setTarget(e.target.value)} placeholder="e.g., 200000" required min={1} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Goal Icon (Emoji)</label>
          <input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="🎯" maxLength={2} required style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
        </div>
        <button type="submit" style={{ marginTop: 8, padding: '12px 20px', borderRadius: 10, background: 'var(--accent)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 150ms' }}>
          Save Goal
        </button>
      </form>
    </Modal>
  );
}

export function GoalsWidget() {
  const goals = useFinanceStore(s => s.goals);
  const userRole = useFinanceStore(s => s.userRole);
  const [modalOpen, setModalOpen] = useState(false);
  
  if (!goals || goals.length === 0) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      style={{
        padding: 24, background: 'var(--bg-card)',
        borderRadius: 12, border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)', height: '100%', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Target size={18} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Savings Goals</h3>
        </div>
        {userRole === 'admin' && (
          <button onClick={() => setModalOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Plus size={14} /> Add
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
        {goals.map((goal, i) => {
          const percent = Math.min(100, Math.round((goal.saved / goal.target) * 100));
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13, fontWeight: 500 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>{goal.icon}</span> <span style={{ color: 'var(--text-primary)' }}>{goal.name}</span>
                </span>
                <span className="font-mono-num" style={{ color: 'var(--text-secondary)' }}>
                  ₹{goal.saved.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-hover)', borderRadius: 4, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.2, delay: 0.2 + (i * 0.1), ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent), #818cf8)', borderRadius: 4 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      <AddGoalModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}
