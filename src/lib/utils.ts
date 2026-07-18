import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerHaptic(type: 'tap' | 'success' | 'error' | 'heavy' = 'tap') {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      if (type === 'tap') {
        window.navigator.vibrate(15);
      } else if (type === 'success') {
        window.navigator.vibrate([40, 40, 40]);
      } else if (type === 'error') {
        window.navigator.vibrate([100, 50, 100]);
      } else if (type === 'heavy') {
        window.navigator.vibrate(60);
      }
    } catch (e) {
      // Ignore vibration errors or restrictions
    }
  }
}
