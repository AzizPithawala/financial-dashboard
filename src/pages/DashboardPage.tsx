// FINOVA v3.0 — Dashboard Page
import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { SummaryCards, TrendChart, CategoryDonut } from '../features/dashboard/DashboardFeatures';
import { GoalsWidget } from '../features/dashboard/GoalsWidget';
import { BudgetCard } from '../features/budgets/BudgetFeatures';
import { AddTransactionModal } from '../features/transactions/TransactionFeatures';
import { EmptyState } from '../components/ui/SharedComponents';
import { useInsightsSummary, useInsightsTrend, useInsightsCategories, useAddTransaction } from '../hooks';
import { useFinanceStore } from '../store/financeStore';
import confetti from 'canvas-confetti';
import { bus } from '../utils/eventBus';
import toast from 'react-hot-toast';

export function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: summary, isLoading: sumLoading } = useInsightsSummary();
  const { data: trend, isLoading: trendLoading } = useInsightsTrend();
  const { data: categories, isLoading: catLoading } = useInsightsCategories();
  const addMutation = useAddTransaction();
  const txCount = useFinanceStore(s => s.transactions.length);

  // Confetti on first transaction
  useEffect(() => {
    const unsub = bus.on('TRANSACTION_ADDED', () => {
      const count = useFinanceStore.getState().transactions.length;
      if (count === 1) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success('Great start! 🎉 Your first transaction!', { duration: 3000 });
      } else {
        toast.success('Transaction added!', { duration: 2000 });
      }
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      <Header title="Dashboard" subtitle="Your financial overview" onAddTransaction={() => setModalOpen(true)} />
      <div style={{ padding: '24px 32px' }}>
        {txCount === 0 && !sumLoading ? (
          <EmptyState onAction={() => setModalOpen(true)} />
        ) : (
          <>
            <SummaryCards summary={summary} isLoading={sumLoading} trendData={trend} />
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <TrendChart data={trend ?? []} isLoading={trendLoading} />
              <CategoryDonut data={categories ?? []} isLoading={catLoading} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginTop: 16 }}>
              <GoalsWidget />
              <BudgetCard />
            </div>
          </>
        )}
      </div>
      <AddTransactionModal
        open={modalOpen} onClose={() => setModalOpen(false)}
        onSubmit={(t) => { addMutation.mutate(t); setModalOpen(false); }}
        isLoading={addMutation.isPending}
      />
    </div>
  );
}
