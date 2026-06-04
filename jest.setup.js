// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = global.TextEncoder || TextEncoder
global.TextDecoder = global.TextDecoder || TextDecoder

if (typeof global.Request === 'undefined') {
  class MockRequest {
    constructor(input, init = {}) {
      Object.defineProperty(this, 'url', {
        value: typeof input === 'string' ? input : input?.url,
        configurable: true,
      })
      Object.defineProperty(this, 'method', {
        value: init.method || 'GET',
        configurable: true,
      })
      Object.defineProperty(this, 'headers', {
        value: new Headers(init.headers),
        configurable: true,
      })
      Object.defineProperty(this, 'body', {
        value: init.body,
        configurable: true,
      })
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
  }

  global.Request = MockRequest
}

if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.headers = new Headers(init.headers)
    }

    static json(body, init = {}) {
      return new MockResponse(JSON.stringify(body), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...(init.headers || {}),
        },
      })
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }
  }
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class MockHeaders {
    constructor(init = {}) {
      this.map = new Map(Object.entries(init))
    }

    get(key) {
      return this.map.get(key)
    }
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      toString: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useParams() {
    return {}
  },
  redirect: jest.fn(),
  notFound: jest.fn(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

// Mock next-auth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    promise: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    confirmCardPayment: jest.fn(),
  })),
}))

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => children,
  CardElement: () => <div data-testid="card-element">Card Element</div>,
  PaymentElement: () => <div data-testid="card-element">Payment Element</div>,
  useStripe: () => ({
    confirmCardPayment: jest.fn(),
    confirmPayment: jest.fn(),
  }),
  useElements: () => ({
    getElement: jest.fn(),
  }),
}))

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    order: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    orderItem: {
      findFirst: jest.fn(),
    },
    review: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    newsletter: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret-key-for-testing'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123456789'
process.env.STRIPE_SECRET_KEY = 'sk_test_123456789'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test123'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = jest.fn()

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks()
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  localStorageMock.removeItem.mockClear()
  localStorageMock.clear.mockClear()
})
