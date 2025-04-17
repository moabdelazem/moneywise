import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Adjust currency as needed
  }).format(amount);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: 'short',
      day: 'numeric',
      year: (new Date(date).getFullYear() !== new Date().getFullYear()) ? 'numeric' : undefined,
    }).format(new Date(date));
  } catch (e) {
    console.error("Failed to format date:", date, e);
    return String(date); // Fallback
  }
}