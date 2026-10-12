import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** 2490 -> "R$ 24,90" (pt-BR, no Intl overhead per render). */
export function brl(priceCents: number): string {
  return `R$ ${(priceCents / 100).toFixed(2).replace('.', ',')}`;
}

/** Max 140 chars for card descriptions. */
export function clamp(s: string, n = 140): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s;
}
