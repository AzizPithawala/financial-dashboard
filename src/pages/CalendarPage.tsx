// FINOVA v3.1 — Calendar Page
import { Header } from '../components/layout/Header';
import { FinancialCalendar } from '../features/calendar/CalendarFeatures';

export function CalendarPage() {
  return (
    <div>
      <Header title="Calendar" subtitle="Daily cash flow overview" />
      <div style={{ padding: '24px 32px' }}>
        <FinancialCalendar />
      </div>
    </div>
  );
}
