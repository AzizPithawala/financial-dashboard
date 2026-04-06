// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Core Type Definitions
// ═══════════════════════════════════════════════════════════════════

export const CATEGORIES = [
  'salary', 'freelance', 'food', 'transport',
  'shopping', 'entertainment', 'utilities', 'other'
] as const;

export type Category = typeof CATEGORIES[number];

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  type: TransactionType;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface Filters {
  search: string;
  category: Category | 'all';
  type: TransactionType | 'all';
  dateFrom: string;
  dateTo: string;
  page: number;
  pageSize: number;
}

export interface PagedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Summary {
  income: number;
  expense: number;
  savings: number;
  score: number;
  scoreLabel: HealthScoreLabel;
}

export interface TrendData {
  month: string; // 'Jan', 'Feb', ...
  income: number;
  expense: number;
  savings: number;
}

export interface CategoryData {
  category: Category;
  total: number;
  percentage: number;
  color: string;
}

export type HealthScoreLabel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type IntentType =
  | 'highest_expense'
  | 'monthly_total'
  | 'savings_status'
  | 'category_breakdown'
  | 'trend_analysis'
  | 'health_check'
  | 'general';

export const CATEGORY_COLORS: Record<Category, string> = {
  salary: '#059669',
  freelance: '#7C3AED',
  food: '#F59E0B',
  transport: '#0EA5E9',
  shopping: '#EC4899',
  entertainment: '#8B5CF6',
  utilities: '#14B8A6',
  other: '#6B7280',
};

export interface Budget {
  category: Category;
  limit: number;
}

export interface BudgetProgress {
  category: Category;
  limit: number;
  spent: number;
  percentage: number;
  remaining: number;
  status: 'safe' | 'warning' | 'exceeded';
  color: string;
}

export const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  dateFrom: '',
  dateTo: '',
  page: 1,
  pageSize: 20,
};
