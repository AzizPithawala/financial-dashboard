// FINOVA v3.0 — Insights Features
import { motion } from 'framer-motion';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { AlertTriangle, Award, Calendar, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Summary, TrendData, CategoryData, Transaction } from '../../types';
import { getScoreColor, getScoreLabel } from '../../utils/healthScore';
import { Skeleton } from '../../components/ui/SharedComponents';
import { differenceInDays, endOfMonth } from 'date-fns';
import { useBudgetProgress } from '../budgets/BudgetFeatures';

export function HealthScoreRing({ score, isLoading }: { score: number; isLoading: boolean }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const circ = 2 * Math.PI * 45;
  const offset = circ - (score / 100) * circ;

  if (isLoading) return <div className="card" style={{ padding: 32, textAlign: 'center' }}><Skeleton width={160} height={160} /></div>;

  return (
    <motion.div className="card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }} style={{ padding: 32, textAlign: 'center' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Financial Health Score</h3>
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r="45" fill="none" stroke="var(--border-color)" strokeWidth="8" />
          <motion.circle cx="80" cy="80" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <motion.span className="font-mono-num" style={{ fontSize: 36, fontWeight: 700, color }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{score}</motion.span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
        </div>
      </div>
      <p style={{ marginTop: 20, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {score >= 80 && "Outstanding! You're saving a healthy portion of your income."}
        {score >= 60 && score < 80 && 'Good work! A few adjustments could boost your score.'}
        {score >= 40 && score < 60 && 'Fair. Consider reducing non-essential expenses.'}
        {score < 40 && 'Needs attention. Your expenses are outpacing your income.'}
      </p>
    </motion.div>
  );
}

export function MonthlyTrendAreaChart({ data, isLoading }: { data: TrendData[]; isLoading: boolean }) {
  if (isLoading) return <div className="card" style={{ padding: 24 }}><Skeleton height={280} /></div>;
  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }} style={{ padding: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Cash Flow Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis dataKey="month" fontSize={12} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
          <YAxis fontSize={12} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
            formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
          <defs>
            <linearGradient id="ig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.15}/><stop offset="95%" stopColor="#059669" stopOpacity={0}/></linearGradient>
            <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#DC2626" stopOpacity={0.15}/><stop offset="95%" stopColor="#DC2626" stopOpacity={0}/></linearGradient>
          </defs>
          <Area type="monotone" dataKey="income" stroke="#059669" strokeWidth={2} fill="url(#ig)" name="Income" />
          <Area type="monotone" dataKey="expense" stroke="#DC2626" strokeWidth={2} fill="url(#eg)" name="Expense" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function CategoryBreakdown({ data, isLoading }: { data: CategoryData[]; isLoading: boolean }) {
  if (isLoading) return <div className="card" style={{ padding: 24 }}><Skeleton height={280} /></div>;
  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }} style={{ padding: 24 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Category Breakdown</h3>
      {data.length === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No expense data</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
            <XAxis type="number" fontSize={12} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <YAxis type="category" dataKey="category" fontSize={12} tick={{ fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }}
              formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
            <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((e) => <Cell key={e.category} fill={e.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

export function SmartBanners({ summary }: { summary: Summary | undefined }) {
  const budgets = useBudgetProgress();
  if (!summary) return null;
  const now = new Date();
  const daysLeft = differenceInDays(endOfMonth(now), now);
  const banners: { icon: React.ReactNode; text: string; color: string; bg: string }[] = [];

  if (daysLeft <= 3) banners.push({ icon: <Calendar size={18} />, text: `Month closes in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} — ${summary.savings >= 0 ? 'on track!' : 'watch spending!'}`, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' });
  if (summary.expense > summary.income && summary.income > 0) banners.push({ icon: <AlertTriangle size={18} />, text: `Spending exceeds income by ₹${(summary.expense - summary.income).toLocaleString('en-IN')}`, color: '#DC2626', bg: 'rgba(220,38,38,0.08)' });
  if (summary.score >= 80) banners.push({ icon: <Award size={18} />, text: `Excellent! You're saving ${summary.score}% of your income.`, color: '#059669', bg: 'rgba(5,150,105,0.08)' });
  
  budgets.forEach(b => {
    if (b.status === 'exceeded') {
      banners.push({ icon: <AlertTriangle size={18} />, text: `${b.category.charAt(0).toUpperCase() + b.category.slice(1)} budget exceeded by ₹${Math.abs(b.remaining).toLocaleString('en-IN')}`, color: '#DC2626', bg: 'rgba(220,38,38,0.08)' });
    } else if (b.status === 'warning') {
      banners.push({ icon: <AlertCircle size={18} />, text: `${b.category.charAt(0).toUpperCase() + b.category.slice(1)} budget is at ${b.percentage}% capacity`, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' });
    }
  });

  if (banners.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
      {banners.map((b, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 10, background: b.bg, color: b.color, fontSize: 14, fontWeight: 500 }}>
          {b.icon}{b.text}
        </motion.div>
      ))}
    </div>
  );
}

export function TopSpendingDayRadar({ data, isLoading }: { data: Transaction[]; isLoading: boolean }) {
  if (isLoading) return <div className="card" style={{ padding: 24 }}><Skeleton height={280} /></div>;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const agg = [0, 0, 0, 0, 0, 0, 0];
  data.filter(d => d.type === 'expense').forEach(d => {
    const day = new Date(d.date).getDay();
    agg[day] += d.amount;
  });

  const chartData = days.map((day, i) => ({ day, amount: agg[i] }));

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, height: '100%' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Top Spending Day</h3>
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar name="Spending" dataKey="amount" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
          <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: 13 }} formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

export function MonthOverMonthVariance({ data, isLoading }: { data: Transaction[]; isLoading: boolean }) {
  if (isLoading) return <div className="card" style={{ padding: 24 }}><Skeleton height={140} /></div>;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastYear = lastMonthDate.getFullYear();

  let curExp = 0, lastExp = 0;

  data.filter(t => t.type === 'expense').forEach(t => {
    const d = new Date(t.date);
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) curExp += t.amount;
    else if (d.getMonth() === lastMonth && d.getFullYear() === lastYear) lastExp += t.amount;
  });

  const variance = lastExp === 0 ? 0 : ((curExp - lastExp) / lastExp) * 100;
  const isUp = variance > 0;

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 24, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 24 }}>Month-over-Month Variance</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="font-mono-num" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>₹{curExp.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>this month</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, padding: '10px 14px', background: isUp ? 'rgba(220,38,38,0.08)' : 'rgba(5,150,105,0.08)', color: isUp ? '#DC2626' : '#059669', borderRadius: 8, width: 'fit-content' }}>
          {isUp ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
          {Math.abs(variance).toFixed(1)}% vs last month (₹{lastExp.toLocaleString('en-IN')})
        </div>
      </div>
    </motion.div>
  );
}
