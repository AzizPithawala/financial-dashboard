// FINOVA v3.1 — Calendar Features
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay,
  addMonths, subMonths
} from 'date-fns';
import { useFinanceStore } from '../../store/financeStore';

export function FinancialCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const transactions = useFinanceStore(s => s.transactions);
  const navigate = useNavigate();

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const monthTrans = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const handleDayClick = (date: Date) => {
    // Navigate to transactions page and set filter to this specific day
    // The filter expects YYYY-MM-DD
    const dateStr = format(date, 'yyyy-MM-dd');
    useFinanceStore.setState(s => ({
      filters: { ...s.filters, dateFrom: dateStr, dateTo: dateStr, page: 1 }
    }));
    navigate('/transactions');
  };

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
          {format(currentDate, 'MMMM yyyy')}
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="button" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', height: 36, padding: '0 12px' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="button" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', height: 36, padding: '0 12px' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {d}
          </div>
        ))}

        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          
          const dayTxns = isCurrentMonth ? monthTrans.filter(t => isSameDay(new Date(t.date), day)) : [];
          const income = dayTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const expense = dayTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          const net = income - expense;

          let bg = 'var(--bg-primary)';
          let border = '1px solid var(--border-color)';
          if (isCurrentMonth && (income > 0 || expense > 0)) {
            if (net > 0) bg = 'rgba(5, 150, 105, 0.05)';
            else if (net < 0) bg = 'rgba(220, 38, 38, 0.05)';
            else bg = 'rgba(99, 102, 241, 0.05)';
          }
          if (isToday) border = '1px solid var(--accent)';

          return (
            <div
              key={day.toString()}
              onClick={() => handleDayClick(day)}
              style={{
                background: bg, border, borderRadius: 8, padding: 8, minHeight: 80,
                opacity: isCurrentMonth ? 1 : 0.4, cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: isToday ? 'var(--accent)' : 'var(--text-secondary)', marginBottom: 8 }}>
                {format(day, 'd')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {income > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '2px 4px', borderRadius: 4 }}>
                    +₹{(income/1000).toFixed(1)}k
                  </div>
                )}
                {expense > 0 && (
                  <div style={{ fontSize: 11, fontWeight: 500, color: '#DC2626', background: 'rgba(220,38,38,0.1)', padding: '2px 4px', borderRadius: 4 }}>
                    -₹{(expense/1000).toFixed(1)}k
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
