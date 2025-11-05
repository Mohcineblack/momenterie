# Testing Documentation

This document provides comprehensive information about testing the Momenterie e-commerce platform.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Getting Started](#getting-started)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Mocking](#mocking)
- [CI/CD](#cicd)
- [Coverage](#coverage)
- [Troubleshooting](#troubleshooting)

## Testing Stack

The project uses a modern testing stack with the following tools:

- **Jest** - Unit and integration testing framework
- **React Testing Library** - Component testing utilities
- **Playwright** - End-to-end testing framework
- **MSW (Mock Service Worker)** - API mocking
- **jest-mock-extended** - Advanced mocking for Prisma

## Getting Started

### Install Dependencies

```bash
npm install
```

All testing dependencies are already included in `package.json`.

### Setup Environment

Create a `.env.test` file for test-specific environment variables:

```env
DATABASE_URL="postgresql://test:test@localhost:5432/test_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="test-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_123"
STRIPE_SECRET_KEY="sk_test_123"
```

## Running Tests

### Unit and Integration Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- button.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="Cart"
```

### End-to-End Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific E2E test file
npx playwright test product-browsing.spec.ts

# Run E2E tests on specific browser
npx playwright test --project=chromium
```

### Run All Tests

```bash
npm run test:all
```

## Test Structure

```
momenterie/
├── __tests__/
│   ├── utils/
│   │   └── test-utils.tsx          # Testing utilities
│   └── mocks/
│       ├── stripe.ts                # Stripe mocks
│       └── prisma.ts                # Prisma mocks
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── __tests__/
│   │           ├── button.test.tsx
│   │           └── input.test.tsx
│   ├── store/
│   │   └── __tests__/
│   │       └── cart-store.test.ts
│   └── app/
│       └── api/
│           └── products/
│               └── __tests__/
│                   └── route.test.ts
├── e2e/
│   ├── product-browsing.spec.ts
│   ├── checkout-flow.spec.ts
│   └── editor-flow.spec.ts
├── jest.config.js
├── jest.setup.js
└── playwright.config.ts
```

## Writing Tests

### Component Tests

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Store Tests (Zustand)

```typescript
import { useCartStore } from '../cart-store'
import { act } from '@testing-library/react'

describe('Cart Store', () => {
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearCart()
    })
  })

  it('adds an item to cart', () => {
    const item = { productId: 1, quantity: 1, basePrice: 29.99 }

    act(() => {
      useCartStore.getState().addItem(item)
    })

    expect(useCartStore.getState().items).toHaveLength(1)
  })
})
```

### API Route Tests

```typescript
import { GET } from '../route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma')

describe('GET /api/products', () => {
  it('returns all products', async () => {
    const mockProducts = [{ id: 1, name: 'Test Product' }]
    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const request = new NextRequest('http://localhost:3000/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.data).toEqual(mockProducts)
  })
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Product Browsing', () => {
  test('should display homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('should navigate to product page', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-testid="product-card"]').first().click()
    await expect(page).toHaveURL(/\/products\//)
  })
})
```

## Mocking

### Mocking Prisma

Prisma is automatically mocked in `jest.setup.js`. For specific tests:

```typescript
import { prisma } from '@/lib/prisma'

;(prisma.product.findMany as jest.Mock).mockResolvedValue([
  { id: 1, name: 'Test Product' }
])
```

### Mocking Stripe

```typescript
import { mockStripe } from '@/__tests__/mocks/stripe'

mockStripe.paymentIntents.create.mockResolvedValue({
  id: 'pi_test_123',
  client_secret: 'secret_123'
})
```

### Mocking Next Auth

```typescript
import { auth } from '@/lib/auth'

;(auth as jest.Mock).mockResolvedValue({
  user: {
    id: 'user-1',
    email: 'test@example.com'
  }
})
```

### Mocking API Calls

Use MSW for mocking API calls in E2E tests or integration tests:

```typescript
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json({ data: [] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## Test Categories

### Unit Tests

- **UI Components**: Button, Input, Calendar, Popover
- **Utilities**: Astronomy calculations, Stripe helpers
- **Store**: Cart, Editor stores (citymap, starmap, etc.)

**Location**: `src/**/__tests__/`

### Integration Tests

- **API Routes**: Products, Checkout, Reviews, Admin
- **Complex Components**: Product grid, Cart drawer, Checkout form

**Location**: `src/app/api/**/__tests__/`

### E2E Tests

- **User Flows**: Browse → Add to Cart → Checkout → Payment
- **Editor Flows**: Customize product → Add to cart
- **Admin Flows**: Order management

**Location**: `e2e/`

## CI/CD

Tests run automatically on GitHub Actions for:

- **Pull Requests**: All tests run on PR creation and updates
- **Push to main/develop**: Full test suite runs

### Workflow Jobs

1. **Unit Tests**: Runs on Node 18.x and 20.x
2. **E2E Tests**: Runs on latest Node with Playwright
3. **Lint**: Code quality checks
4. **Build**: Ensures app builds successfully

View workflow: `.github/workflows/test.yml`

## Coverage

### Current Coverage Goals

- **Lines**: 80%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 80%

### Viewing Coverage

```bash
npm run test:coverage
```

Coverage reports are generated in `coverage/` directory.

### Coverage Reports

- **HTML Report**: `coverage/lcov-report/index.html`
- **JSON**: `coverage/coverage-final.json`
- **LCOV**: `coverage/lcov.info`

## Best Practices

1. **Test Naming**: Use descriptive names
   ```typescript
   it('should add product to cart when customize button is clicked')
   ```

2. **Arrange-Act-Assert**: Structure tests clearly
   ```typescript
   // Arrange
   const item = createTestItem()

   // Act
   act(() => useCartStore.getState().addItem(item))

   // Assert
   expect(useCartStore.getState().items).toHaveLength(1)
   ```

3. **Cleanup**: Always clean up after tests
   ```typescript
   afterEach(() => {
     jest.clearAllMocks()
     cleanup()
   })
   ```

4. **Data-testid**: Use for E2E test selectors
   ```typescript
   <div data-testid="product-card">...</div>
   ```

5. **Async Testing**: Always await async operations
   ```typescript
   await user.click(button)
   await waitFor(() => expect(element).toBeVisible())
   ```

## Troubleshooting

### Common Issues

#### Tests fail with "Cannot find module"

**Solution**: Clear Jest cache
```bash
npx jest --clearCache
npm test
```

#### Playwright tests timeout

**Solution**: Increase timeout in test
```typescript
test('my test', async ({ page }) => {
  test.setTimeout(60000) // 60 seconds
  // ... test code
})
```

#### Mock not working

**Solution**: Ensure mock is defined before import
```typescript
jest.mock('@/lib/prisma')
import { prisma } from '@/lib/prisma'
```

#### localStorage errors in tests

**Solution**: Already mocked in `jest.setup.js`. If needed, reset:
```typescript
beforeEach(() => {
  localStorage.clear()
})
```

### Debug Mode

#### Jest Debug

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

#### Playwright Debug

```bash
npx playwright test --debug
```

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all tests pass: `npm run test:all`
3. Check coverage: `npm run test:coverage`
4. Update this documentation if needed

---

**Happy Testing! 🧪**
