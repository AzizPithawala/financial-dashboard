// FINOVA v3.0 — App Root
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CalendarPage } from './pages/CalendarPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ChatWindow } from './features/chat/ChatFeature';
import { CommandPalette } from './features/command/CommandPalette';
import { useTheme } from './hooks';
import { useFinanceStore } from './store/financeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function ThemeInit() {
  useTheme(); // initializes theme on mount
  return null;
}

function AppInit() {
  const loadMockData = useFinanceStore(s => s.loadMockData);
  const txCount = useFinanceStore(s => s.transactions.length);
  useEffect(() => {
    // Override local storage if it hasn't caught up to our new 25-item mock dataset
    if (txCount < 20) {
      loadMockData(); 
    }
  }, [txCount, loadMockData]);
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInit />
        <AppInit />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <CommandPalette />
        <ChatWindow />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 10,
              fontSize: 14,
              boxShadow: 'var(--shadow-lg)',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
