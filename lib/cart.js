'use client';
// The store cart: plugin slugs kept in this browser (localStorage), shared by every component on the page.
import React from 'react';
import { products } from './site';

const KEY = 'rat_cart';
const listeners = new Set();
let items = null; // null until read from storage
let open = false;

const read = () => {
  if (items) return items;
  try { items = JSON.parse(localStorage.getItem(KEY) || '[]').filter((s) => products[s] && !products[s].free); } catch { items = []; }
  return items;
};
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };
const emit = () => { snap = { items: read(), open }; listeners.forEach((l) => l()); };
let snap = { items: [], open: false };
const EMPTY = { items: [], open: false };

export const cart = {
  add(slug) { read(); if (!items.includes(slug)) { items = [...items, slug]; save(); } open = true; emit(); },
  remove(slug) { read(); items = items.filter((s) => s !== slug); save(); emit(); },
  clear() { items = []; save(); emit(); },
  show(v = true) { open = v; emit(); },
  total(list) { return (list || read()).reduce((n, s) => n + (products[s]?.price || 0), 0); },
};

export function useCart() {
  const subscribe = React.useCallback((l) => { listeners.add(l); if (!items) emit(); return () => listeners.delete(l); }, []);
  return React.useSyncExternalStore(subscribe, () => snap, () => EMPTY);
}
