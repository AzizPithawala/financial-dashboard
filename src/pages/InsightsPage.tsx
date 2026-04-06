// FINOVA v3.0 — Insights Page
import { Header } from '../components/layout/Header';
import { HealthScoreRing, MonthlyTrendAreaChart, CategoryBreakdown, SmartBanners, TopSpendingDayRadar, MonthOverMonthVariance } from '../features/insights/InsightsFeatures';
import { useInsightsSummary, useInsightsTrend, useInsightsCategories, useTransactions } from '../hooks';

export function InsightsPage() {
  const { data: summary, isLoading: sumLoading } = useInsightsSummary();
  const { data: trend, isLoading: trendLoading } = useInsightsTrend();
  const { data: categories, isLoading: catLoading } = useInsightsCategories();
  
  // Need raw transaction data for deep analytics
  const { data: txData, isLoading: txLoading } = useTransactions({ page: 1, pageSize: 1000, type: 'all', category: 'all', search: '', dateFrom: '', dateTo: '' });
  const rawData = txData?.data ?? [];

  return (
    <div>
      <Header title="Insights" subtitle="Understand your financial patterns" />
      <div style={{ padding: '24px 32px' }}>
        <SmartBanners summary={summary} />
        <div className="grid-responsive-2" style={{ marginBottom: 16 }}>
          <HealthScoreRing score={summary?.score ?? 0} isLoading={sumLoading} />
          <MonthlyTrendAreaChart data={trend ?? []} isLoading={trendLoading} />
        </div>
        <div className="grid-responsive-3">
          <CategoryBreakdown data={categories ?? []} isLoading={catLoading} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <MonthOverMonthVariance data={rawData} isLoading={txLoading} />
            <TopSpendingDayRadar data={rawData} isLoading={txLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
