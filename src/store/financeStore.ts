// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Zustand Finance Store (spec B.5)
// Flat, normalized, single source of truth
// ═══════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, Filters, Category, TransactionType, Budget, DEFAULT_FILTERS as _DF } from '../types';
import { INITIAL_MOCK_TRANSACTIONS } from '../utils/mockData';

interface FinanceStore {
  // Data
  transactions: Transaction[];
  budgets: Budget[];
  goals: { id: string; name: string; target: number; saved: number; icon: string }[];
  
  // UI State
  userRole: 'admin' | 'viewer';
  filters: Filters;
  theme: 'light' | 'dark';
  densityMode: 'compact' | 'comfortable';
  chatOpen: boolean;
  sidebarCollapsed: boolean;

  // Actions
  setUserRole: (role: 'admin' | 'viewer') => void;
  loadMockData: () => void;
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => Transaction;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: { name: string; target: number; icon: string }) => void;
  setFilters: (f: Partial<Filters>) => void;
  resetFilters: () => void;
  toggleTheme: () => void;
  setDensityMode: (mode: 'compact' | 'comfortable') => void;
  setChatOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  setBudget: (category: Category, limit: number) => void;
  removeBudget: (category: Category) => void;
}

const defaultFilters: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  dateFrom: '',
  dateTo: '',
  page: 1,
  pageSize: 20,
};

let idCounter = Date.now();

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      userRole: 'admin',
      transactions: [],
      budgets: [],
      goals: [
        { id: 'g1', name: 'Macbook Pro', target: 200000, saved: 85000, icon: '💻' },
        { id: 'g2', name: 'Maldives Trip', target: 150000, saved: 45000, icon: '✈️' }
      ],
      filters: { ...defaultFilters },
      theme: 'light',
      densityMode: 'comfortable',
      chatOpen: false,
      sidebarCollapsed: false,
      commandPaletteOpen: false,

      addTransaction: (t) => {
        const newTxn: Transaction = {
          ...t,
          id: String(++idCounter),
          createdAt: new Date().toISOString(),
        };
        set(s => ({ transactions: [newTxn, ...s.transactions] }));
        return newTxn;
      },

      deleteTransaction: (id) => {
        set(s => ({ transactions: s.transactions.filter(t => t.id !== id) }));
      },

      addGoal: (goal) => {
        set(s => ({
          goals: [
            ...s.goals,
            { ...goal, id: crypto.randomUUID(), saved: 0 }
          ]
        }));
      },

      setFilters: (f) => {
        set(s => ({ filters: { ...s.filters, ...f } }));
      },

      resetFilters: () => {
        set({ filters: { ...defaultFilters } });
      },

      toggleTheme: () => {
        set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' }));
      },

      setDensityMode: (mode) => set({ densityMode: mode }),

      setChatOpen: (open) => set({ chatOpen: open }),

      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      setUserRole: (role) => set({ userRole: role }),

      loadMockData: () => set({ transactions: INITIAL_MOCK_TRANSACTIONS }),

      setBudget: (category, limit) => {
        set(s => {
          const existing = s.budgets.filter(b => b.category !== category);
          return { budgets: [...existing, { category, limit }] };
        });
      },

      removeBudget: (category) => {
        set(s => ({ budgets: s.budgets.filter(b => b.category !== category) }));
      },
    }),
    {
      name: 'finova-finance-store',
      partialize: (state) => ({
        userRole: state.userRole,
        transactions: state.transactions,
        budgets: state.budgets,
        goals: state.goals,
        theme: state.theme,
        densityMode: state.densityMode,
      }),
    }
  )
);
