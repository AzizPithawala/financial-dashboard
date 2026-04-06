import type { Transaction } from '../types';

const now = Date.now();
const DAY = 86400000;

export const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  // Current Month Data
  { id: 'm1', amount: 95000, category: 'salary', type: 'income', description: 'TechCorp Salary', date: new Date(now - 1 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm2', amount: 25000, category: 'utilities', type: 'expense', description: 'Monthly Rent', date: new Date(now - 2 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm3', amount: 650, category: 'food', type: 'expense', description: 'Starbucks Coffee', date: new Date(now - 3 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm4', amount: 4500, category: 'food', type: 'expense', description: 'Groceries (Whole Foods)', date: new Date(now - 4 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm5', amount: 1200, category: 'transport', type: 'expense', description: 'Uber Rides', date: new Date(now - 5 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm6', amount: 8400, category: 'shopping', type: 'expense', description: 'Amazon Electronics', date: new Date(now - 7 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm7', amount: 2000, category: 'entertainment', type: 'expense', description: 'Netflix & Spotify', date: new Date(now - 8 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm8', amount: 15500, category: 'freelance', type: 'income', description: 'Upwork Client Payment', date: new Date(now - 10 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm9', amount: 3200, category: 'food', type: 'expense', description: 'Dinner at Bistro', date: new Date(now - 12 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  
  // Previous Month (Last 30 Days)
  { id: 'm10', amount: 95000, category: 'salary', type: 'income', description: 'TechCorp Salary', date: new Date(now - 31 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm11', amount: 25000, category: 'utilities', type: 'expense', description: 'Monthly Rent', date: new Date(now - 32 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm12', amount: 5200, category: 'food', type: 'expense', description: 'Groceries (Trader Joes)', date: new Date(now - 34 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm13', amount: 8000, category: 'transport', type: 'expense', description: 'Car Maintenance', date: new Date(now - 38 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm14', amount: 4000, category: 'shopping', type: 'expense', description: 'Zara Clothing', date: new Date(now - 42 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm15', amount: 15400, category: 'freelance', type: 'income', description: 'Fiverr Web Design', date: new Date(now - 45 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm16', amount: 6500, category: 'entertainment', type: 'expense', description: 'Concert Tickets', date: new Date(now - 48 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },

  // 2 Months Ago
  { id: 'm17', amount: 92000, category: 'salary', type: 'income', description: 'TechCorp Salary', date: new Date(now - 62 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm18', amount: 25000, category: 'utilities', type: 'expense', description: 'Monthly Rent', date: new Date(now - 63 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm19', amount: 4800, category: 'food', type: 'expense', description: 'Weekly Groceries', date: new Date(now - 68 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm20', amount: 3500, category: 'utilities', type: 'expense', description: 'Electricity & Internet', date: new Date(now - 70 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm21', amount: 12000, category: 'freelance', type: 'income', description: 'Consulting Call', date: new Date(now - 75 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm22', amount: 850, category: 'food', type: 'expense', description: 'Burger Joint', date: new Date(now - 80 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  
  // 3 Months Ago
  { id: 'm23', amount: 92000, category: 'salary', type: 'income', description: 'TechCorp Salary', date: new Date(now - 92 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm24', amount: 25000, category: 'utilities', type: 'expense', description: 'Monthly Rent', date: new Date(now - 93 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  { id: 'm25', amount: 10500, category: 'entertainment', type: 'expense', description: 'Weekend Getaway', date: new Date(now - 95 * DAY).toISOString().split('T')[0], createdAt: new Date().toISOString() },
];
