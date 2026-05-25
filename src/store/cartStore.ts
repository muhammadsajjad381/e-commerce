
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items:     [],
      isOpen:    false,

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0);
      },

      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart:() => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (product, variant, quantity = 1) => {
        const { items } = get();
        const existingIdx = items.findIndex(
          (i) => i.product._id === product._id && i.variant._id === variant._id
        );

        if (existingIdx !== -1) {
          const newItems = [...items];
          newItems[existingIdx] = {
            ...newItems[existingIdx],
            quantity: newItems[existingIdx].quantity + quantity,
          };
          set({ items: newItems });
          toast.success('Cart updated!', { icon: '🛒' });
        } else {
          set({
            items: [
              ...items,
              {
                product,
                variant,
                quantity,
                addedAt: new Date().toISOString(),
              },
            ],
          });
          toast.success(`${product.title} added to cart`, { icon: '✅' });
        }
      },

      removeItem: (productId, variantId) => {
        set((s) => ({
          items: s.items.filter(
            (i) => !(i.product._id === productId && i.variant._id === variantId)
          ),
        }));
        toast('Item removed from cart', { icon: '🗑️' });
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId, variantId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.product._id === productId && i.variant._id === variantId
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name:    'ecom-cart',
      storage: createJSONStorage(() => localStorage),
    
      partialize: (s) => ({ items: s.items }),
    }
  )
);

export default useCartStore;
