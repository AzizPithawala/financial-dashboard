// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Mock API Service Layer (spec C.1)
// Simulates server-side operations against Zustand store
// ═══════════════════════════════════════════════════════════════════

import { useFinanceStore } from '../store/financeStore';
import { calculateHealthScore, getScoreLabel } from '../utils/healthScore';
import type {
  Transaction, Filters, PagedResponse, Summary,
  TrendData, CategoryData, Category, CATEGORY_COLORS as _CC,
} from '../types';
import { CATEGORY_COLORS } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function applyFilters(transactions: Transaction[], filters: Filters): Transaction[] {
  let result = [...transactions];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(t =>
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  }

  if (filters.category !== 'all') {
    result = result.filter(t => t.category === filters.category);
  }

  if (filters.type !== 'all') {
    result = result.filter(t => t.type === filters.type);
  }

  if (filters.dateFrom) {
    result = result.filter(t => t.date >= filters.dateFrom);
  }

  if (filters.dateTo) {
    result = result.filter(t => t.date <= filters.dateTo);
  }

  // Sort by date descending
  result.sort((a, b) => b.date.localeCompare(a.date));

  return result;
}

export const api = {
  transactions: {
    list: async (filters: Filters): Promise<PagedResponse<Transaction>> => {
      await delay(200);
      const all = useFinanceStore.getState().transactions;
      const filtered = applyFilters(all, filters);
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      return {
        data: filtered.slice(start, end),
        total: filtered.length,
        page: filters.page,
        pageSize: filters.pageSize,
      };
    },

    listAll: async (filters: Omit<Filters, 'page' | 'pageSize'>): Promise<Transaction[]> => {
      await delay(100);
      const all = useFinanceStore.getState().transactions;
      return applyFilters(all, { ...filters, page: 1, pageSize: 999999 });
    },

    create: async (t: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
      await delay(300);
      return useFinanceStore.getState().addTransaction(t);
    },

    remove: async (id: string): Promise<void> => {
      await delay(200);
      useFinanceStore.getState().deleteTransaction(id);
    },
  },

  insights: {
    summary: async (): Promise<Summary> => {
      await delay(200);
      const txns = useFinanceStore.getState().transactions;
      const now = new Date();
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

      const monthTxns = txns.filter(t => t.date >= monthStart && t.date <= monthEnd);
      const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const savings = income - expense;
      const score = calculateHealthScore(income, expense);

      return { income, expense, savings, score, scoreLabel: getScoreLabel(score) };
    },

    trend: async (): Promise<TrendData[]> => {
      await delay(250);
      const txns = useFinanceStore.getState().transactions;
      const months: TrendData[] = [];

      for (let i = 11; i >= 0; i--) {
        const d = subMonths(new Date(), i);
        const ms = startOfMonth(d);
        const me = endOfMonth(d);

        const monthTxns = txns.filter(t => {
          const td = parseISO(t.date);
          return isWithinInterval(td, { start: ms, end: me });
        });

        const income = monthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = monthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        months.push({
          month: format(d, 'MMM'),
          income,
          expense,
          savings: income - expense,
        });
      }
      return months;
    },

    categories: async (): Promise<CategoryData[]> => {
      await delay(200);
      const txns = useFinanceStore.getState().transactions;
      const now = new Date();
      const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

      const monthExpenses = txns.filter(t =>
        t.type === 'expense' && t.date >= monthStart && t.date <= monthEnd
      );

      const totalExpense = monthExpenses.reduce((s, t) => s + t.amount, 0);

      const catMap = new Map<Category, number>();
      monthExpenses.forEach(t => {
        catMap.set(t.category, (catMap.get(t.category) || 0) + t.amount);
      });

      const categories: CategoryData[] = Array.from(catMap.entries())
        .map(([category, total]) => ({
          category,
          total,
          percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
          color: CATEGORY_COLORS[category],
        }))
        .sort((a, b) => b.total - a.total);

      return categories;
    },
  },
};
