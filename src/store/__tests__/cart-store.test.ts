import { useCartStore, CartItem } from '../cart-store'
import { act } from '@testing-library/react'

// Helper to create a test cart item
const createTestItem = (overrides = {}): Omit<CartItem, 'id'> => ({
  productId: 1,
  productName: 'Test Product',
  productSlug: 'test-product',
  variantId: 1,
  variantName: 'Default Variant',
  quantity: 1,
  basePrice: 2999,
  variantPrice: 0,
  customizationData: {
    date: '2024-01-01',
    eventName: 'Test Event',
    style: {
      typography: 'classic',
      colorScheme: 'black',
    },
  },
  previewImageUrl: '/test.jpg',
  ...overrides,
})

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store before each test
    act(() => {
      useCartStore.getState().clearCart()
    })
  })

  describe('addItem', () => {
    it('adds an item to the cart', () => {
      const item = createTestItem()

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0]).toMatchObject(item)
      expect(state.items[0].id).toBeDefined()
    })

    it('auto-opens cart when item is added', () => {
      const item = createTestItem()

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const state = useCartStore.getState()
      expect(state.isOpen).toBe(true)
    })

    it('allows multiple items to be added', () => {
      const item1 = createTestItem({ productId: 1 })
      const item2 = createTestItem({ productId: 2 })

      act(() => {
        useCartStore.getState().addItem(item1)
        useCartStore.getState().addItem(item2)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
    })

    it('generates unique IDs for each item', () => {
      const item = createTestItem()

      act(() => {
        useCartStore.getState().addItem(item)
        useCartStore.getState().addItem(item)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(2)
      expect(state.items[0].id).not.toBe(state.items[1].id)
    })
  })

  describe('removeItem', () => {
    it('removes an item from the cart', () => {
      const item = createTestItem()

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().removeItem(itemId)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('only removes the specified item', () => {
      const item1 = createTestItem({ productId: 1 })
      const item2 = createTestItem({ productId: 2 })

      act(() => {
        useCartStore.getState().addItem(item1)
        useCartStore.getState().addItem(item2)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().removeItem(itemId)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(1)
      expect(state.items[0].productId).toBe(2)
    })
  })

  describe('updateQuantity', () => {
    it('updates the quantity of an item', () => {
      const item = createTestItem({ quantity: 1 })

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().updateQuantity(itemId, 3)
      })

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(3)
    })

    it('removes item when quantity is set to 0', () => {
      const item = createTestItem({ quantity: 2 })

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().updateQuantity(itemId, 0)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })

    it('removes item when quantity is negative', () => {
      const item = createTestItem({ quantity: 2 })

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().updateQuantity(itemId, -1)
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
    })
  })

  describe('updateItem', () => {
    it('updates specific properties of an item', () => {
      const item = createTestItem()

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const itemId = useCartStore.getState().items[0].id

      act(() => {
        useCartStore.getState().updateItem(itemId, {
          quantity: 5,
          variantPrice: 1000,
        })
      })

      const state = useCartStore.getState()
      expect(state.items[0].quantity).toBe(5)
      expect(state.items[0].variantPrice).toBe(1000)
      expect(state.items[0].basePrice).toBe(2999) // Unchanged
    })
  })

  describe('clearCart', () => {
    it('removes all items from the cart', () => {
      act(() => {
        useCartStore.getState().addItem(createTestItem({ productId: 1 }))
        useCartStore.getState().addItem(createTestItem({ productId: 2 }))
        useCartStore.getState().addItem(createTestItem({ productId: 3 }))
      })

      expect(useCartStore.getState().items).toHaveLength(3)

      act(() => {
        useCartStore.getState().clearCart()
      })

      const state = useCartStore.getState()
      expect(state.items).toHaveLength(0)
      expect(state.isOpen).toBe(false)
    })
  })

  describe('cart drawer state', () => {
    it('opens the cart', () => {
      act(() => {
        useCartStore.getState().openCart()
      })

      expect(useCartStore.getState().isOpen).toBe(true)
    })

    it('closes the cart', () => {
      act(() => {
        useCartStore.getState().openCart()
      })

      expect(useCartStore.getState().isOpen).toBe(true)

      act(() => {
        useCartStore.getState().closeCart()
      })

      expect(useCartStore.getState().isOpen).toBe(false)
    })

    it('toggles the cart', () => {
      expect(useCartStore.getState().isOpen).toBe(false)

      act(() => {
        useCartStore.getState().toggleCart()
      })

      expect(useCartStore.getState().isOpen).toBe(true)

      act(() => {
        useCartStore.getState().toggleCart()
      })

      expect(useCartStore.getState().isOpen).toBe(false)
    })
  })

  describe('getTotalItems', () => {
    it('returns 0 for empty cart', () => {
      const total = useCartStore.getState().getTotalItems()
      expect(total).toBe(0)
    })

    it('calculates total items correctly', () => {
      act(() => {
        useCartStore.getState().addItem(createTestItem({ quantity: 2 }))
        useCartStore.getState().addItem(createTestItem({ quantity: 3 }))
        useCartStore.getState().addItem(createTestItem({ quantity: 1 }))
      })

      const total = useCartStore.getState().getTotalItems()
      expect(total).toBe(6)
    })
  })

  describe('getTotalPrice', () => {
    it('returns 0 for empty cart', () => {
      const total = useCartStore.getState().getTotalPrice()
      expect(total).toBe(0)
    })

    it('calculates total price correctly with base price only', () => {
      act(() => {
        useCartStore.getState().addItem(
          createTestItem({ basePrice: 1000, variantPrice: 0, quantity: 2 })
        )
        useCartStore.getState().addItem(
          createTestItem({ basePrice: 1500, variantPrice: 0, quantity: 1 })
        )
      })

      const total = useCartStore.getState().getTotalPrice()
      expect(total).toBe(3500)
    })

    it('calculates total price correctly with base + variant price', () => {
      act(() => {
        useCartStore.getState().addItem(
          createTestItem({ basePrice: 1000, variantPrice: 500, quantity: 2 })
        )
        useCartStore.getState().addItem(
          createTestItem({ basePrice: 2000, variantPrice: 1000, quantity: 1 })
        )
      })

      const total = useCartStore.getState().getTotalPrice()
      expect(total).toBe(6000)
    })
  })

  describe('getItemPrice', () => {
    it('calculates item price correctly', () => {
      const item = createTestItem({ basePrice: 2999, variantPrice: 1000 })

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const cartItem = useCartStore.getState().items[0]
      const price = useCartStore.getState().getItemPrice(cartItem)

      expect(price).toBe(3999)
    })

    it('handles items with no variant price', () => {
      const item = createTestItem({ basePrice: 2999, variantPrice: 0 })

      act(() => {
        useCartStore.getState().addItem(item)
      })

      const cartItem = useCartStore.getState().items[0]
      const price = useCartStore.getState().getItemPrice(cartItem)

      expect(price).toBe(2999)
    })
  })
})
