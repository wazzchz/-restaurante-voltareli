/**
 * Real-time open/closed status for Seg–Sáb 11:00–14:00.
 * Uses the visitor's local time (restaurant + visitor share BRT in practice).
 * Exported pure for testability; hook re-evaluates every minute.
 */
export interface OpenStatus {
  open: boolean;
  label: string;
}

export function getOpenStatus(now = new Date()): OpenStatus {
  const day = now.getDay(); // 0 = Sunday
  const mins = now.getHours() * 60 + now.getMinutes();
  const inWindow = mins >= 11 * 60 && mins < 14 * 60;
  const workday = day >= 1 && day <= 6;

  if (workday && inWindow) {
    return { open: true, label: 'Aberto agora · 11h às 14h' };
  }
  if (day === 0) return { open: false, label: 'Fechado · abre segunda às 11h' };
  if (mins < 11 * 60) return { open: false, label: 'Fechado · abre hoje às 11h' };
  return { open: false, label: 'Fechado · abre amanhã às 11h' };
}

export { getOpenStatus as isOpenNow };
