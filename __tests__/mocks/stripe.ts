export const mockStripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_test_123',
      client_secret: 'pi_test_123_secret_456',
      amount: 3499,
      currency: 'eur',
      status: 'requires_payment_method',
    }),
    retrieve: jest.fn().mockResolvedValue({
      id: 'pi_test_123',
      amount: 3499,
      currency: 'eur',
      status: 'succeeded',
    }),
    confirm: jest.fn().mockResolvedValue({
      id: 'pi_test_123',
      status: 'succeeded',
    }),
  },
  customers: {
    create: jest.fn().mockResolvedValue({
      id: 'cus_test_123',
      email: 'test@example.com',
    }),
    retrieve: jest.fn().mockResolvedValue({
      id: 'cus_test_123',
      email: 'test@example.com',
    }),
  },
  webhooks: {
    constructEvent: jest.fn((payload, signature, secret) => ({
      id: 'evt_test_123',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_123',
          amount: 3499,
          currency: 'eur',
          status: 'succeeded',
          metadata: {
            orderId: 'order-123',
          },
        },
      },
    })),
  },
}

export const mockStripeJs = {
  confirmCardPayment: jest.fn().mockResolvedValue({
    paymentIntent: {
      id: 'pi_test_123',
      status: 'succeeded',
    },
  }),
  createPaymentMethod: jest.fn().mockResolvedValue({
    paymentMethod: {
      id: 'pm_test_123',
    },
  }),
}

export default mockStripe
