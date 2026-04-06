// ═══════════════════════════════════════════════════════════════════
// FINOVA v3.0 — Health Score Calculator
// ═══════════════════════════════════════════════════════════════════

import type { HealthScoreLabel } from '../types';

export function calculateHealthScore(income: number, expense: number): number {
  if (income === 0) return 0;
  const savingsRatio = (income - expense) / income;
  return Math.min(100, Math.max(0, Math.round(savingsRatio * 100)));
}

export function getScoreLabel(score: number): HealthScoreLabel {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#059669'; // emerald
  if (score >= 60) return '#10B981'; // green
  if (score >= 40) return '#F59E0B'; // amber
  return '#DC2626'; // red
}
