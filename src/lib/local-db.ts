// Tiny reactive localStorage store backing the whole app.
// Subscribes via useSyncExternalStore for SSR-safe, render-stable snapshots.
import { useCallback, useSyncExternalStore } from "react";

const snapshots = new Map<string, unknown>();
const listeners = new Set<() => void>();

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function ensure<T>(key: string, fallback: T) {
  if (!snapshots.has(key)) snapshots.set(key, load(key, fallback));
}

function emit() {
  listeners.forEach((l) => l());
}

export function getLocal<T>(key: string, fallback: T): T {
  ensure(key, fallback);
  return snapshots.get(key) as T;
}

export function setLocal<T>(key: string, value: T) {
  snapshots.set(key, value);
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
  emit();
}

export function updateLocal<T>(key: string, fallback: T, updater: (prev: T) => T) {
  ensure(key, fallback);
  const next = updater(snapshots.get(key) as T);
  setLocal(key, next);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (!e.key) return;
    if (snapshots.has(e.key)) {
      snapshots.set(e.key, load(e.key, snapshots.get(e.key)));
      emit();
    }
  });
}

export function useLocal<T>(key: string, fallback: T): T {
  return useSyncExternalStore(
    useCallback((cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    }, []),
    () => {
      ensure(key, fallback);
      return snapshots.get(key) as T;
    },
    () => fallback,
  );
}

export function uid(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
