import { User, Product, ProductVariant, Category, Order, OrderItem, Address, Review, Cart, CartItem } from '@prisma/client';

// Extended User type with session info
export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: string;
}

// Product with relations
export interface ProductWithRelations extends Product {
  category: Category;
  variants: ProductVariant[];
  reviews: Review[];
  _count?: {
    reviews: number;
  };
}

// Cart with items
export interface CartWithItems extends Cart {
  items: (CartItem & {
    product?: Product;
    variant?: ProductVariant | null;
  })[];
}

// Order with all relations
export interface OrderWithRelations extends Order {
  items: (OrderItem & {
    product: Product;
    variant?: ProductVariant | null;
  })[];
  shippingAddress: Address;
  billingAddress: Address;
  user: User;
}

// Customization data types for different product types
export interface CityMapCustomization {
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  date?: string;
  customText: {
    title: string;
    subtitle?: string;
    coordinates?: boolean;
  };
  style: {
    mapStyle: string;
    colorScheme: string;
  };
}

export interface StarMapCustomization {
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  customText: {
    title: string;
    message?: string;
  };
  style: {
    colorTheme: string;
    showConstellations: boolean;
  };
}

export interface PuzzleCustomization {
  imageUrl: string;
  pieceCount: number;
  customBoxText?: string;
}

export interface SongDisplayCustomization {
  spotifyTrackId: string;
  trackName: string;
  artistName: string;
  albumArt: string;
  spotifyCode: string;
  colorTheme: string;
  customText?: string;
}

export interface PhotoPrintCustomization {
  imageUrl: string;
  filter?: string;
  customText?: string;
}

export interface DatePrintCustomization {
  date: string;
  eventName: string;
  style: {
    typography: string;
    colorScheme: string;
  };
}

export interface DefinitionPrintCustomization {
  word: string;
  definition: string;
  pronunciation?: string;
  style: {
    layout: string;
    colorScheme: string;
  };
}

export interface JewelryCustomization {
  date: string;
  location: {
    lat: number;
    lng: number;
  };
  material: 'gold' | 'silver' | 'rose-gold';
  chainLength: string;
}

export type CustomizationData =
  | CityMapCustomization
  | StarMapCustomization
  | PuzzleCustomization
  | SongDisplayCustomization
  | PhotoPrintCustomization
  | DatePrintCustomization
  | DefinitionPrintCustomization
  | JewelryCustomization;

// Cart store types
export interface CartStoreItem {
  id: string;
  productId: number;
  variantId?: number;
  quantity: number;
  customizationData: CustomizationData;
  previewImageUrl?: string;
  price: number;
}

// Checkout types
export interface CheckoutFormData {
  email: string;
  shipping: {
    firstName: string;
    lastName: string;
    company?: string;
    street: string;
    street2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billing: {
    sameAsShipping: boolean;
    firstName?: string;
    lastName?: string;
    company?: string;
    street?: string;
    street2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
  };
  shippingMethod: string;
  paymentMethod: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Filter and sort options
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  bestseller?: boolean;
  search?: string;
}

export interface SortOption {
  field: 'price' | 'name' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
}
