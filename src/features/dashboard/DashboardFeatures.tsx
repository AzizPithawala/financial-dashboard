// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Dashboard Features
// SummaryCards, TrendChart, CategoryDonut
// ═══════════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target } from 'lucide-react';
import type { Summary, TrendData, CategoryData } from '../../types';
import { Skeleton } from '../../components/ui/SharedComponents';
import { getScoreColor } from '../../utils/healthScore';

// ── AnimatedCounter ─────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '₹' }: { value: number; prefix?: string }) {
  return (
    <motion.span
      className="font-mono-num"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      style={{ fontSize: 28, fontWeight: 600 }}
    >
      {prefix}{value.toLocaleString('en-IN')}
    </motion.span>
  );
}

// ── SummaryCards ─────────────────────────────────────────────────
interface SummaryCardsProps {
  summary: Summary | undefined;
  isLoading: boolean;
  trendData?: TrendData[];
}

export function SummaryCards({ summary, isLoading, trendData }: SummaryCardsProps) {
  const cards = [
    {
      label: 'Total Income',
      value: summary?.income ?? 0,
      icon: TrendingUp,
      color: '#059669',
      bgGrad: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(5,150,105,0.02))',
      sparkColor: '#059669',
      trend: trendData?.map(d => ({ v: d.income })) ?? [],
    },
    {
      label: 'Total Expense',
      value: summary?.expense ?? 0,
      icon: TrendingDown,
      color: '#DC2626',
      bgGrad: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.02))',
      sparkColor: '#DC2626',
      trend: trendData?.map(d => ({ v: d.expense })) ?? [],
    },
    {
      label: 'Net Savings',
      value: summary?.savings ?? 0,
      icon: Wallet,
      color: '#6366f1',
      bgGrad: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.02))',
      sparkColor: '#6366f1',
      trend: trendData?.map(d => ({ v: d.savings })) ?? [],
    },
    {
      label: 'Health Score',
      value: summary?.score ?? 0,
      icon: Target,
      color: getScoreColor(summary?.score ?? 0),
      bgGrad: `linear-gradient(135deg, ${getScoreColor(summary?.score ?? 0)}14, ${getScoreColor(summary?.score ?? 0)}05)`,
      sparkColor: getScoreColor(summary?.score ?? 0),
      prefix: '',
      suffix: `/100 · ${summary?.scoreLabel ?? '—'}`,
      trend: [],
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 16,
      marginBottom: 24,
    }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          style={{
            padding: '20px 24px',
            background: card.bgGrad,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Skeleton width={100} height={14} />
              <Skeleton width={140} height={32} />
            </div>
          ) : (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {card.label}
                </span>
                <card.icon size={18} style={{ color: card.color }} strokeWidth={1.5} />
              </div>
              <div>
                <AnimatedNumber
                  value={card.value}
                  prefix={'prefix' in card ? card.prefix : '₹'}
                />
                {'suffix' in card && card.suffix && (
                  <span style={{
                    fontSize: 12, color: card.color,
                    marginLeft: 8, fontWeight: 500,
                  }}>
                    {card.suffix}
                  </span>
                )}
              </div>

              {/* Sparkline */}
              {card.trend.length > 0 && (
                <div style={{
                  position: 'absolute', bottom: 0, right: 0, width: 100, height: 40,
                  opacity: 0.4,
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={card.trend}>
                      <Area
                        type="monotone" dataKey="v"
                        stroke={card.sparkColor} fill={card.sparkColor}
                        strokeWidth={1.5} fillOpacity={0.15}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// ── TrendChart (spec A.3 — Line Chart) ──────────────────────────
interface TrendChartProps {
  data: TrendData[];
  isLoading: boolean;
}

export function TrendChart({ data, isLoading }: TrendChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const avgInc = data.reduce((s, d) => s + d.income, 0) / data.length;
    const avgExp = data.reduce((s, d) => s + d.expense, 0) / data.length;
    
    const enhanced = data.map(d => ({ ...d, predInc: null as number | null, predExp: null as number | null }));
    const last = enhanced[enhanced.length - 1];
    
    last.predInc = last.income;
    last.predExp = last.expense;
    
    enhanced.push({
      month: 'Predicted',
      income: null as any,
      expense: null as any,
      savings: null as any,
      predInc: avgInc,
      predExp: avgExp,
    });
    return enhanced;
  }, [data]);

  if (isLoading) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <Skeleton width={120} height={16} />
        <div style={{ marginTop: 16 }}><Skeleton height={260} /></div>
      </div>
    );
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{ padding: 24 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
          Monthly Trend & Forecast
        </h3>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: 4 }}>
          Dashed lines indicate AI projection
        </span>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis
            dataKey="month" fontSize={12}
            tick={{ fill: 'var(--text-muted)' }}
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis
            fontSize={12}
            tick={{ fill: 'var(--text-muted)' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              fontSize: 13,
              boxShadow: 'var(--shadow-md)',
            }}
            formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
          />
          <Line type="monotone" dataKey="income" stroke="#059669" strokeWidth={2} dot={false} name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} dot={false} name="Expense" />
          <Line type="monotone" dataKey="predInc" stroke="#059669" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted Income" />
          <Line type="monotone" dataKey="predExp" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted Expense" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

// ── CategoryDonut (spec A.3 — Donut Chart) ──────────────────────
interface CategoryDonutProps {
  data: CategoryData[];
  isLoading: boolean;
}

export function CategoryDonut({ data, isLoading }: CategoryDonutProps) {
  const topCategories = data.slice(0, 5);
  const otherTotal = data.slice(5).reduce((s, d) => s + d.total, 0);
  const chartData = otherTotal > 0
    ? [...topCategories, { category: 'other' as const, total: otherTotal, percentage: 0, color: '#6B7280' }]
    : topCategories;

  if (isLoading) {
    return (
      <div className="card" style={{ padding: 24 }}>
        <Skeleton width={120} height={16} />
        <div style={{ marginTop: 16 }}><Skeleton height={260} /></div>
      </div>
    );
  }

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      style={{ padding: 24 }}
    >
      <h3 style={{
        fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
        marginBottom: 20,
      }}>
        Expense by Category
      </h3>
      {chartData.length === 0 ? (
        <div style={{
          height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 14,
        }}>
          No expense data yet
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData} dataKey="total" nameKey="category"
                cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                paddingAngle={2} strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 8, fontSize: 13,
                }}
                formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {chartData.map(d => (
              <div key={d.category} style={{
                display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
                color: 'var(--text-secondary)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 2, background: d.color,
                }} />
                <span style={{ textTransform: 'capitalize' }}>{d.category}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
