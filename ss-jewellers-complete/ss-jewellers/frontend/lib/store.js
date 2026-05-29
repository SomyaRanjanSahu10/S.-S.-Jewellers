import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ── Cart Store ────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const { items } = get();
        const existing = items.find((i) => i._id === product._id);
        if (existing) {
          set({ items: items.map((i) => i._id === product._id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...items, { ...product, qty }] });
        }
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i._id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) return get().removeItem(id);
        set({ items: get().items.map((i) => i._id === id ? { ...i, qty } : i) });
      },

      clearCart: () => set({ items: [] }),

      get subtotal() { return get().items.reduce((s, i) => s + i.price * i.qty, 0); },
      get makingCharges() { return Math.round(get().items.reduce((s, i) => s + i.price * i.qty * ((i.makingChargePercent || 12) / 100), 0)); },
      get gst() { return Math.round((get().subtotal + get().makingCharges) * 0.03); },
      get total() { return get().subtotal + get().makingCharges + get().gst; },
      get count() { return get().items.reduce((s, i) => s + i.qty, 0); },
    }),
    { name: 'ss-jewellers-cart', storage: createJSONStorage(() => localStorage) }
  )
);

// ── Wishlist Store ────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const { items } = get();
        const exists = items.find((i) => i._id === product._id);
        set({ items: exists ? items.filter((i) => i._id !== product._id) : [...items, product] });
        return !exists; // true = added, false = removed
      },

      isWishlisted: (id) => !!get().items.find((i) => i._id === id),

      count: () => get().items.length,
    }),
    { name: 'ss-jewellers-wishlist', storage: createJSONStorage(() => localStorage) }
  )
);

// ── Auth Store ────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoggedIn:   false,

      login: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, isLoggedIn: true });
      },

      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false });
      },

      updateUser: (updates) => set({ user: { ...get().user, ...updates } }),
    }),
    { name: 'ss-jewellers-auth', storage: createJSONStorage(() => localStorage) }
  )
);

// ── UI Store (no persistence) ─────────────────────────────
export const useUIStore = create((set) => ({
  cartOpen:   false,
  menuOpen:   false,
  searchOpen: false,

  openCart:   () => set({ cartOpen: true }),
  closeCart:  () => set({ cartOpen: false }),
  toggleCart: () => set((s) => ({ cartOpen: !s.cartOpen })),

  openMenu:   () => set({ menuOpen: true }),
  closeMenu:  () => set({ menuOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),

  openSearch:  () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}));
