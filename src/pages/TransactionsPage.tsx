// FINOVA v3.0 — Transactions Page
import { useState, useCallback } from 'react';
import { Header } from '../components/layout/Header';
import { FilterBar, TransactionTable, Pagination, AddTransactionModal, exportTransactionsCSV } from '../features/transactions/TransactionFeatures';
import { EmptyState } from '../components/ui/SharedComponents';
import { useTransactions, useAddTransaction, useDeleteTransaction, useDebounce } from '../hooks';
import { useFinanceStore } from '../store/financeStore';
import type { Filters } from '../types';
import { DEFAULT_FILTERS } from '../types';
import toast from 'react-hot-toast';

export function TransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS });
  const debouncedSearch = useDebounce(filters.search, 350);
  const queryFilters = { ...filters, search: debouncedSearch };
  const { data, isLoading } = useTransactions(queryFilters);
  const addMutation = useAddTransaction();
  const deleteMutation = useDeleteTransaction();
  const densityMode = useFinanceStore(s => s.densityMode);
  const allTxns = useFinanceStore(s => s.transactions);

  const handleFilterChange = useCallback((f: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...f }));
  }, []);

  const handleReset = useCallback(() => setFilters({ ...DEFAULT_FILTERS }), []);

  const handleExport = useCallback(() => {
    exportTransactionsCSV(allTxns);
    toast.success('CSV exported!');
  }, [allTxns]);

  const handleDelete = useCallback((id: string) => {
    deleteMutation.mutate(id);
    toast.success('Transaction deleted');
  }, [deleteMutation]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

  return (
    <div>
      <Header title="Transactions" subtitle="Manage your income & expenses" onAddTransaction={() => setModalOpen(true)} />
      <div style={{ padding: '0 32px 32px' }}>
        <FilterBar
          filters={filters} onChange={handleFilterChange} onReset={handleReset}
          resultCount={total} onExport={handleExport}
        />
        {total === 0 && !isLoading ? (
          <EmptyState
            title="No transactions found"
            description={filters.search || filters.category !== 'all' || filters.type !== 'all'
              ? 'Try adjusting your filters'
              : 'Add your first transaction to get started'}
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <>
            <TransactionTable
              data={data?.data ?? []} isLoading={isLoading}
              onDelete={handleDelete} densityMode={densityMode}
            />
            <Pagination
              page={filters.page} totalPages={totalPages} total={total}
              onPrev={() => handleFilterChange({ page: Math.max(1, filters.page - 1) })}
              onNext={() => handleFilterChange({ page: Math.min(totalPages, filters.page + 1) })}
              isFirst={filters.page === 1} isLast={filters.page >= totalPages}
            />
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
