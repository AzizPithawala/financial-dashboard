// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Event Bus (spec B.6)
// Side-effects (toast, confetti, analytics) decouple from store
// ═══════════════════════════════════════════════════════════════════

import type { Transaction, Filters } from '../types';

export type AppEvent =
  | { type: 'TRANSACTION_ADDED'; payload: Transaction }
  | { type: 'TRANSACTION_DELETED'; payload: { id: string } }
  | { type: 'HEALTH_SCORE_CHANGED'; payload: { old: number; new: number } }
  | { type: 'MONTHLY_RECORD_BROKEN'; payload: { amount: number; previous: number } }
  | { type: 'FILTER_CHANGED'; payload: Filters };

type Listener<T = AppEvent> = (event: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Listener<any>>>();

  on<T extends AppEvent['type']>(
    type: T,
    callback: Listener<Extract<AppEvent, { type: T }>>
  ) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);
    return () => this.listeners.get(type)?.delete(callback);
  }

  emit<T extends AppEvent>(event: T) {
    const set = this.listeners.get(event.type);
    if (set) {
      set.forEach(cb => cb(event));
    }
  }
}

export const bus = new EventBus();
