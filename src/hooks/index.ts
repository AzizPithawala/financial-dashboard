// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Custom Hooks
// ═══════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '../services/api';
import { useFinanceStore } from '../store/financeStore';
import { bus } from '../utils/eventBus';
import type { Filters, Transaction } from '../types';

// ── useDebounce (spec D.2) ──────────────────────────────────────
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// ── useTransactions (spec C.2) ──────────────────────────────────
export function useTransactions(filters: Filters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => api.transactions.list(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// ── useAddTransaction ───────────────────────────────────────────
export function useAddTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (t: Omit<Transaction, 'id' | 'createdAt'>) => api.transactions.create(t),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      bus.emit({ type: 'TRANSACTION_ADDED', payload: data });
    },
  });
}

// ── useDeleteTransaction ────────────────────────────────────────
export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.transactions.remove(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['insights'] });
      bus.emit({ type: 'TRANSACTION_DELETED', payload: { id } });
    },
  });
}

// ── useInsights (spec C.2) ──────────────────────────────────────
export function useInsightsSummary() {
  return useQuery({
    queryKey: ['insights', 'summary'],
    queryFn: () => api.insights.summary(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsightsTrend() {
  return useQuery({
    queryKey: ['insights', 'trend'],
    queryFn: () => api.insights.trend(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useInsightsCategories() {
  return useQuery({
    queryKey: ['insights', 'categories'],
    queryFn: () => api.insights.categories(),
    staleTime: 5 * 60 * 1000,
  });
}

// ── useTheme (spec D.1) ─────────────────────────────────────────
export function useTheme() {
  const theme = useFinanceStore(s => s.theme);
  const toggleTheme = useFinanceStore(s => s.toggleTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Auto-detect: dark after 9pm (spec G.2)
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 21 && theme === 'light') {
      // Only auto-switch, don't force if user manually toggled
    }
  }, []);

  return { theme, toggleTheme };
}

// ── usePagination (spec D.1) ────────────────────────────────────
export function usePagination(total: number, pageSize: number) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    totalPages,
    goTo: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    next: () => setPage(p => Math.min(p + 1, totalPages)),
    prev: () => setPage(p => Math.max(p - 1, 1)),
    isFirst: page === 1,
    isLast: page >= totalPages,
  };
}

// ── useKeyboard (spec D.1) ──────────────────────────────────────
export function useKeyboard(key: string, handler: () => void, meta = true) {
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      const metaOk = !meta || e.metaKey || e.ctrlKey;
      if (metaOk && e.key.toLowerCase() === key.toLowerCase()) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [key, handler, meta]);
}
