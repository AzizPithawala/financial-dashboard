// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Analytics (spec G.3)
// Event taxonomy stub — ready for PostHog / Mixpanel / Amplitude
// ═══════════════════════════════════════════════════════════════════

import type { Category, TransactionType, IntentType } from '../types';

type AnalyticsEvent =
  | { event: 'first_transaction_added'; properties: { category: Category } }
  | { event: 'transaction_added'; properties: { type: TransactionType; category: Category; amount_bucket: string } }
  | { event: 'filter_applied'; properties: { filter_type: string; result_count: number } }
  | { event: 'chat_query_sent'; properties: { intent: IntentType; success: boolean } }
  | { event: 'insights_viewed'; properties: { health_score: number; score_label: string } }
  | { event: 'app_opened'; properties: { days_since_last_open: number } }
  | { event: 'export_downloaded'; properties: { row_count: number; format: 'csv' } }
  | { event: 'theme_toggled'; properties: { theme: 'light' | 'dark' } };

export const track = (ev: AnalyticsEvent) => {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', ev.event, ev.properties);
  }
  // In production: posthog.capture(ev.event, ev.properties);
};
