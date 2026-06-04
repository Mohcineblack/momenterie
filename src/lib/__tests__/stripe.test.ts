import { createPaymentIntent, formatPrice, calculateOrderTotal, stripe } from '../stripe'

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  }))
})

describe('Stripe Utilities', () => {
  describe('createPaymentIntent', () => {
    it('creates a payment intent with correct amount', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        amount: 3499,
        currency: 'eur',
      })

      stripe.paymentIntents.create = mockCreate

      const result = await createPaymentIntent({
        amount: 3499,
        currency: 'eur',
        metadata: { orderId: 'order-123' },
      })

      expect(mockCreate).toHaveBeenCalledWith({
        amount: 3499, // Amount in cents
        currency: 'eur',
        metadata: { orderId: 'order-123' },
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('client_secret')
    })

    it('handles different currencies', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        id: 'pi_test_456',
        amount: 2999,
        currency: 'usd',
      })

      stripe.paymentIntents.create = mockCreate

      await createPaymentIntent({
        amount: 2999,
        currency: 'usd',
      })

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          currency: 'usd',
        })
      )
    })

    it('includes metadata in payment intent', async () => {
      const mockCreate = jest.fn().mockResolvedValue({
        id: 'pi_test_789',
        metadata: { orderId: 'order-456', userId: 'user-123' },
      })

      stripe.paymentIntents.create = mockCreate

      await createPaymentIntent({
        amount: 49.99,
        currency: 'eur',
        metadata: {
          orderId: 'order-456',
          userId: 'user-123',
        },
      })

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            orderId: 'order-456',
            userId: 'user-123',
          },
        })
      )
    })

    it('handles payment intent creation errors', async () => {
      const mockCreate = jest.fn().mockRejectedValue(
        new Error('Payment intent creation failed')
      )

      stripe.paymentIntents.create = mockCreate

      await expect(
        createPaymentIntent({
          amount: 3499,
          currency: 'eur',
        })
      ).rejects.toThrow('Payment intent creation failed')
    })
  })

  describe('formatPrice', () => {
    it('formats price in EUR with 2 decimals', () => {
      expect(formatPrice(2999, 'EUR')).toBe('€29.99')
      expect(formatPrice(10000, 'EUR')).toBe('€100.00')
      expect(formatPrice(50, 'EUR')).toBe('€0.50')
    })

    it('formats price in USD with 2 decimals', () => {
      expect(formatPrice(2999, 'USD')).toBe('$29.99')
      expect(formatPrice(10000, 'USD')).toBe('$100.00')
    })

    it('formats price in GBP with 2 decimals', () => {
      expect(formatPrice(2999, 'GBP')).toBe('£29.99')
    })

    it('handles large amounts', () => {
      expect(formatPrice(123456, 'EUR')).toBe('€1,234.56')
      expect(formatPrice(1000000, 'EUR')).toBe('€10,000.00')
    })

    it('handles zero amount', () => {
      expect(formatPrice(0, 'EUR')).toBe('€0.00')
    })

    it('rounds to 2 decimal places', () => {
      expect(formatPrice(3000, 'EUR')).toBe('€30.00')
      expect(formatPrice(2999, 'EUR')).toBe('€29.99')
    })
  })

  describe('calculateOrderTotal', () => {
    it('calculates total with subtotal and shipping', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 495,
      })

      expect(result.total).toBe(595)
      expect(result.subtotal).toBe(100)
      expect(result.shippingCost).toBe(495)
      expect(result.tax).toBe(0)
      expect(result.discount).toBe(0)
    })

    it('applies discount to total', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 495,
        discount: 10,
      })

      expect(result.total).toBe(585)
      expect(result.discount).toBe(10)
    })

    it('calculates tax on subtotal', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 495,
        taxRate: 0.2, // 20% tax
      })

      expect(result.tax).toBe(20) // 20% of 100
      expect(result.total).toBe(615)
    })

    it('applies discount before calculating tax', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 495,
        discount: 10,
        taxRate: 0.2,
      })

      expect(result.subtotalAfterDiscount).toBe(90)
      expect(result.tax).toBe(18) // 20% of 90
      expect(result.total).toBe(603)
    })

    it('handles free shipping', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 0,
      })

      expect(result.total).toBe(100)
      expect(result.shippingCost).toBe(0)
    })

    it('handles percentage discount', () => {
      const result = calculateOrderTotal({
        subtotal: 100,
        shippingCost: 495,
        discountPercentage: 10, // 10% off
      })

      expect(result.discount).toBe(10) // 10% of 100
      expect(result.total).toBe(585)
    })

    it('caps discount at subtotal amount', () => {
      const result = calculateOrderTotal({
        subtotal: 50,
        shippingCost: 495,
        discount: 100, // Discount larger than subtotal
      })

      expect(result.discount).toBe(50) // Capped at subtotal
      expect(result.total).toBe(495) // Only shipping remains
    })

    it('handles complex calculation with all factors', () => {
      const result = calculateOrderTotal({
        subtotal: 200,
        shippingCost: 10,
        discount: 20,
        taxRate: 0.15,
      })

      expect(result.subtotalAfterDiscount).toBe(180)
      expect(result.tax).toBe(27) // 15% of 180
      expect(result.total).toBe(217) // 180 + 27 + 10
    })

    it('rounds to 2 decimal places', () => {
      const result = calculateOrderTotal({
        subtotal: 3333,
        shippingCost: 495,
        taxRate: 0.15,
      })

      // Tax: 33.33 * 0.15 = 4.9995 ≈ 5.00
      expect(result.tax).toBe(500)
      expect(result.total).toBe(4328)
    })
  })

  describe('Price conversion', () => {
    it('converts euros to cents correctly', () => {
      expect(Math.round(29.99 * 100)).toBe(2999)
      expect(Math.round(100 * 100)).toBe(10000)
      expect(Math.round(0.5 * 100)).toBe(50)
    })

    it('converts cents to euros correctly', () => {
      expect(2999 / 100).toBe(29.99)
      expect(10000 / 100).toBe(100)
      expect(50 / 100).toBe(0.5)
    })
  })
})
