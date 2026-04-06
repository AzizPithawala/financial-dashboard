import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, ScanLine, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import type { Category, TransactionType } from '../../types';

interface ScannedData {
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
}

export function ReceiptScannerModal({ open, onClose, onComplete }: { open: boolean, onClose: () => void, onComplete: (d: ScannedData) => void }) {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'success'>('idle');

  useEffect(() => {
    if (!open) setTimeout(() => setPhase('idle'), 300);
  }, [open]);

  const handleStart = () => {
    setPhase('scanning');
    setTimeout(() => {
      setPhase('success');
      setTimeout(() => {
        onComplete({
          amount: Math.floor(Math.random() * 3000) + 500,
          category: 'food',
          type: 'expense',
          description: 'Bistro Dinner (Scanned)',
        });
      }, 1500);
    }, 2500);
  };

  return (
    <Modal open={open} onClose={phase !== 'scanning' ? onClose : () => {}} title="Scan Receipt with AI">
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                onClick={handleStart}
                style={{
                  border: '2px dashed var(--border-color)', borderRadius: 12,
                  padding: '40px 20px', cursor: 'pointer', background: 'var(--bg-hover)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  transition: 'border-color 200ms'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <UploadCloud size={40} style={{ color: 'var(--text-muted)' }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload receipt</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>JPEG, PNG, or PDF up to 5MB</div>
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div key="scan" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div style={{ position: 'relative', width: 220, height: 280, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 8, margin: '0 auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={48} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                {/* Laser */}
                <motion.div
                  initial={{ top: -20 }}
                  animate={{ top: 300 }}
                  transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
                  style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#059669', boxShadow: '0 0 12px 2px rgba(5,150,105,0.6)' }}
                />
              </div>
              <div style={{ marginTop: 24, fontSize: 14, fontWeight: 500, color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <ScanLine className="empty-float" size={16} /> Scanning via Finova Vision...
              </div>
            </motion.div>
          )}

          {phase === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
              <CheckCircle2 size={64} style={{ color: '#059669', marginBottom: 16 }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>Success!</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>Data extracted. Syncing...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
}
