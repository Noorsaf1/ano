/**
 * Collection of utility functions for safely working with client-side features
 */

/**
 * Checks if code is running on the client side
 */
export const isClient = typeof window !== 'undefined';

/**
 * Safely access localStorage
 * @param operation Function that uses localStorage
 * @param fallback Fallback value if localStorage is not available or operation fails
 */
export function safeLocalStorage<T>(operation: () => T, fallback: T): T {
  if (!isClient) return fallback;
  
  try {
    return operation();
  } catch (error) {
    console.error('LocalStorage operation failed:', error);
    return fallback;
  }
}

/**
 * Get an item from localStorage safely
 * @param key The localStorage key
 * @param defaultValue Default value if key doesn't exist or localStorage is not available
 */
export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  return safeLocalStorage(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }, defaultValue);
}

/**
 * Set an item in localStorage safely
 * @param key The localStorage key
 * @param value The value to store
 */
export function setInLocalStorage(key: string, value: any): boolean {
  return safeLocalStorage(() => {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  }, false);
}

/**
 * Creates an object URL safely (client-side only)
 * @param file The file to create a URL for
 * @returns URL string or null if on server
 */
export function createObjectURL(file: File): string | null {
  if (!isClient) return null;
  
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Failed to create object URL:', error);
    return null;
  }
}

/**
 * Revoke an object URL safely
 * @param url The URL to revoke
 */
export function revokeObjectURL(url: string): void {
  if (!isClient) return;
  
  try {
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to revoke object URL:', error);
  }
} 