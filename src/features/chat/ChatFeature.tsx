// FINOVA v3.0 — AI Chat (spec section G)
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';
import { useKeyboard } from '../../hooks';
import type { ChatMessage, IntentType } from '../../types';

// ── Intent Parser ───────────────────────────────────────────────
function parseIntent(msg: string): IntentType {
  const m = msg.toLowerCase();
  if (/highest|most|top.*expense|biggest.*spend/i.test(m)) return 'highest_expense';
  if (/how much.*spend|total.*expense|monthly.*total/i.test(m)) return 'monthly_total';
  if (/sav(e|ing)|enough|surplus/i.test(m)) return 'savings_status';
  if (/category|breakdown|food|transport|shopping|entertainment|utilities/i.test(m)) return 'category_breakdown';
  if (/trend|over time|month.*month|history/i.test(m)) return 'trend_analysis';
  if (/health|score|financial.*health/i.test(m)) return 'health_check';
  return 'general';
}

function generateResponse(intent: IntentType, transactions: any[]): string {
  const expenses = transactions.filter((t: any) => t.type === 'expense');
  const incomes = transactions.filter((t: any) => t.type === 'income');
  const totalExpense = expenses.reduce((s: number, t: any) => s + t.amount, 0);
  const totalIncome = incomes.reduce((s: number, t: any) => s + t.amount, 0);

  const catTotals = new Map<string, number>();
  expenses.forEach((t: any) => catTotals.set(t.category, (catTotals.get(t.category) || 0) + t.amount));
  const sorted = [...catTotals.entries()].sort((a, b) => b[1] - a[1]);

  switch (intent) {
    case 'highest_expense':
      if (sorted.length === 0) return "You haven't recorded any expenses yet. Add some transactions to get insights!";
      return `Your highest expense category is **${sorted[0][0]}** at ₹${sorted[0][1].toLocaleString('en-IN')}. ${sorted.length > 1 ? `Followed by ${sorted[1][0]} at ₹${sorted[1][1].toLocaleString('en-IN')}.` : ''}`;

    case 'monthly_total':
      return `This month, you've spent ₹${totalExpense.toLocaleString('en-IN')} across ${expenses.length} transactions. ${totalIncome > 0 ? `Your income is ₹${totalIncome.toLocaleString('en-IN')}.` : ''}`;

    case 'savings_status': {
      const savings = totalIncome - totalExpense;
      if (totalIncome === 0) return "No income recorded yet. Add income transactions to track savings!";
      const pct = Math.round((savings / totalIncome) * 100);
      return savings >= 0
        ? `Great news! You're saving ₹${savings.toLocaleString('en-IN')} (${pct}% of income). Keep it up!`
        : `Heads up — you're overspending by ₹${Math.abs(savings).toLocaleString('en-IN')}. Consider cutting non-essentials.`;
    }
    case 'category_breakdown':
      if (sorted.length === 0) return "No expense data yet. Start adding transactions!";
      return `Here's your spending breakdown:\n${sorted.map(([c, v]) => `• **${c}**: ₹${v.toLocaleString('en-IN')}`).join('\n')}`;

    case 'trend_analysis':
      return `You have ${transactions.length} total transactions. ${totalIncome > totalExpense ? 'Your income exceeds expenses — positive trend!' : 'Expenses are high relative to income. Keep monitoring.'}`;

    case 'health_check': {
      if (totalIncome === 0) return "Add income data to calculate your health score.";
      const score = Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100));
      const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor';
      return `Your financial health score is **${score}/100** (${label}). ${score >= 60 ? 'You\'re doing well!' : 'There\'s room for improvement.'}`;
    }
    default:
      return "I can help with:\n• \"What's my highest expense?\"\n• \"How much did I spend?\"\n• \"Am I saving enough?\"\n• \"Category breakdown\"\n• \"Financial health score\"";
  }
}

// ── Chat Window ─────────────────────────────────────────────────
export function ChatWindow() {
  const open = useFinanceStore(s => s.chatOpen);
  const setChatOpen = useFinanceStore(s => s.setChatOpen);
  const transactions = useFinanceStore(s => s.transactions);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'assistant', content: "Hi! I'm your finance assistant. Ask me about your spending, savings, or financial health.", timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleChat = useCallback(() => setChatOpen(!open), [open, setChatOpen]);
  useKeyboard('j', toggleChat);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: String(Date.now()), role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    const intent = parseIntent(userMsg.content);
    const response = generateResponse(intent, transactions);

    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: String(Date.now() + 1), role: 'assistant', content: response, timestamp: new Date().toISOString() }]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setChatOpen(true)}
            style={{
              position: 'fixed', bottom: 24, right: 24, zIndex: 40,
              width: 56, height: 56, borderRadius: '50%',
              background: 'var(--accent)', color: '#fff',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Sparkles size={24} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0, width: 380,
            background: 'var(--bg-card)', borderLeft: '1px solid var(--border-color)',
            display: 'flex', flexDirection: 'column', zIndex: 50,
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>AI Assistant</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><X size={16} /></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '16px 16px' }}>
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 12,
                }}>
                <div style={{
                  maxWidth: '85%', padding: '10px 14px', borderRadius: 12,
                  background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-hover)',
                  color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap',
                  borderBottomRightRadius: msg.role === 'user' ? 4 : 12,
                  borderBottomLeftRadius: msg.role === 'assistant' ? 4 : 12,
                }}>
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div style={{ display: 'flex', marginBottom: 12 }}>
                <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--bg-hover)', display: 'flex', gap: 4 }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your finances..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 10,
                  border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
                  color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                }} />
              <button onClick={handleSend} style={{
                width: 40, height: 40, borderRadius: 10, border: 'none',
                background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Send size={16} /></button>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
