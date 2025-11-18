import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'city-maps' },
      update: {},
      create: {
        name: 'City Maps',
        slug: 'city-maps',
        description: 'Custom city maps of your favorite places',
        image: '/images/categories/city-maps.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'star-maps' },
      update: {},
      create: {
        name: 'Star Maps',
        slug: 'star-maps',
        description: 'Personalized star maps showing the night sky',
        image: '/images/categories/star-maps.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'puzzles' },
      update: {},
      create: {
        name: 'Photo Puzzles',
        slug: 'puzzles',
        description: 'Turn your photos into beautiful puzzles',
        image: '/images/categories/puzzles.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'jewelry' },
      update: {},
      create: {
        name: 'Custom Jewelry',
        slug: 'jewelry',
        description: 'Personalized star map jewelry',
        image: '/images/categories/jewelry.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'song-displays' },
      update: {},
      create: {
        name: 'Song Displays',
        slug: 'song-displays',
        description: 'Display your favorite songs beautifully',
        image: '/images/categories/song-displays.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'photo-prints' },
      update: {},
      create: {
        name: 'Photo Prints',
        slug: 'photo-prints',
        description: 'High-quality custom photo prints',
        image: '/images/categories/photo-prints.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  console.log('Creating products...');

  // City Map Product
  const cityMap = await prisma.product.upsert({
    where: { slug: 'custom-city-map' },
    update: {},
    create: {
      name: 'Custom City Map',
      slug: 'custom-city-map',
      description:
        'Create a beautiful custom map of any city or location in the world. Perfect for commemorating special places like where you met, got engaged, or your favorite travel destination.',
      categoryId: categories[0].id,
      basePrice: 29.99,
      images: ['/images/products/city-map-1.jpg', '/images/products/city-map-2.jpg'],
      featured: true,
      bestseller: true,
      variants: {
        create: [
          { name: 'A4 Poster', sku: 'CM-A4-POSTER', size: 'A4', material: 'Poster', priceModifier: 0, stock: 999 },
          { name: 'A3 Poster', sku: 'CM-A3-POSTER', size: 'A3', material: 'Poster', priceModifier: 10, stock: 999 },
          { name: '30x40cm Poster', sku: 'CM-30x40-POSTER', size: '30x40cm', material: 'Poster', priceModifier: 15, stock: 999 },
          { name: '50x70cm Poster', sku: 'CM-50x70-POSTER', size: '50x70cm', material: 'Poster', priceModifier: 25, stock: 999 },
          { name: 'A4 Framed', sku: 'CM-A4-FRAMED', size: 'A4', material: 'Framed', priceModifier: 40, stock: 999 },
          { name: 'A3 Framed', sku: 'CM-A3-FRAMED', size: 'A3', material: 'Framed', priceModifier: 55, stock: 999 },
          { name: '30x40cm Canvas', sku: 'CM-30x40-CANVAS', size: '30x40cm', material: 'Canvas', priceModifier: 50, stock: 999 },
          { name: '50x70cm Canvas', sku: 'CM-50x70-CANVAS', size: '50x70cm', material: 'Canvas', priceModifier: 75, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          {
            fieldName: 'location',
            fieldType: 'location',
            label: 'Location',
            placeholder: 'Enter city or address',
            required: true,
          },
          {
            fieldName: 'title',
            fieldType: 'text',
            label: 'Title',
            placeholder: 'e.g., Paris',
            required: true,
          },
          {
            fieldName: 'subtitle',
            fieldType: 'text',
            label: 'Subtitle',
            placeholder: 'e.g., Where we met',
            required: false,
          },
          {
            fieldName: 'date',
            fieldType: 'date',
            label: 'Special Date',
            placeholder: 'Optional date to display',
            required: false,
          },
          {
            fieldName: 'showCoordinates',
            fieldType: 'select',
            label: 'Show Coordinates',
            options: { values: ['yes', 'no'] },
            required: false,
          },
          {
            fieldName: 'mapStyle',
            fieldType: 'select',
            label: 'Map Style',
            options: {
              values: ['streets', 'light', 'dark', 'satellite', 'outdoors'],
            },
            required: true,
          },
          {
            fieldName: 'colorScheme',
            fieldType: 'color',
            label: 'Color Scheme',
            required: true,
          },
        ],
      },
    },
  });

  // Star Map Product
  const starMap = await prisma.product.upsert({
    where: { slug: 'custom-star-map' },
    update: {},
    create: {
      name: 'Custom Star Map',
      slug: 'custom-star-map',
      description:
        'Capture the exact position of the stars on any date and location. A unique gift commemorating weddings, births, anniversaries, or any special moment.',
      categoryId: categories[1].id,
      basePrice: 34.99,
      images: ['/images/products/star-map-1.jpg', '/images/products/star-map-2.jpg'],
      featured: true,
      bestseller: true,
      variants: {
        create: [
          { name: 'A4 Poster', sku: 'SM-A4-POSTER', size: 'A4', material: 'Poster', priceModifier: 0, stock: 999 },
          { name: 'A3 Poster', sku: 'SM-A3-POSTER', size: 'A3', material: 'Poster', priceModifier: 10, stock: 999 },
          { name: '30x40cm Poster', sku: 'SM-30x40-POSTER', size: '30x40cm', material: 'Poster', priceModifier: 15, stock: 999 },
          { name: '50x70cm Poster', sku: 'SM-50x70-POSTER', size: '50x70cm', material: 'Poster', priceModifier: 25, stock: 999 },
          { name: 'A4 Framed', sku: 'SM-A4-FRAMED', size: 'A4', material: 'Framed', priceModifier: 40, stock: 999 },
          { name: 'A3 Framed', sku: 'SM-A3-FRAMED', size: 'A3', material: 'Framed', priceModifier: 55, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          {
            fieldName: 'date',
            fieldType: 'date',
            label: 'Special Date',
            placeholder: 'Select a date',
            required: true,
          },
          {
            fieldName: 'time',
            fieldType: 'text',
            label: 'Time',
            placeholder: 'e.g., 20:30',
            required: true,
          },
          {
            fieldName: 'location',
            fieldType: 'location',
            label: 'Location',
            placeholder: 'Enter city or address',
            required: true,
          },
          {
            fieldName: 'title',
            fieldType: 'text',
            label: 'Title',
            placeholder: 'e.g., Our Wedding Night',
            required: true,
          },
          {
            fieldName: 'message',
            fieldType: 'text',
            label: 'Message',
            placeholder: 'Optional personal message',
            required: false,
          },
          {
            fieldName: 'colorTheme',
            fieldType: 'select',
            label: 'Color Theme',
            options: {
              values: ['classic-black', 'navy-blue', 'deep-purple', 'midnight-green'],
            },
            required: true,
          },
          {
            fieldName: 'showConstellations',
            fieldType: 'select',
            label: 'Show Constellation Lines',
            options: { values: ['yes', 'no'] },
            required: false,
          },
        ],
      },
    },
  });

  // Foiled Star Map
  await prisma.product.upsert({
    where: { slug: 'foiled-star-map' },
    update: {},
    create: {
      name: 'Foiled Star Map',
      slug: 'foiled-star-map',
      description:
        'Elevate your star map with stunning gold or silver foil accents. A premium option that adds luxury and elegance to your custom print.',
      categoryId: categories[1].id,
      basePrice: 49.99,
      images: ['/images/products/foiled-star-map-1.jpg'],
      featured: true,
      variants: {
        create: [
          { name: 'A4 Gold Foil', sku: 'FSM-A4-GOLD', size: 'A4', material: 'Gold Foil', priceModifier: 0, stock: 999 },
          { name: 'A4 Silver Foil', sku: 'FSM-A4-SILVER', size: 'A4', material: 'Silver Foil', priceModifier: 0, stock: 999 },
          { name: 'A3 Gold Foil', sku: 'FSM-A3-GOLD', size: 'A3', material: 'Gold Foil', priceModifier: 15, stock: 999 },
          { name: 'A3 Silver Foil', sku: 'FSM-A3-SILVER', size: 'A3', material: 'Silver Foil', priceModifier: 15, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          { fieldName: 'date', fieldType: 'date', label: 'Special Date', required: true },
          { fieldName: 'time', fieldType: 'text', label: 'Time', required: true },
          { fieldName: 'location', fieldType: 'location', label: 'Location', required: true },
          { fieldName: 'title', fieldType: 'text', label: 'Title', required: true },
        ],
      },
    },
  });

  // Photo Puzzle
  await prisma.product.upsert({
    where: { slug: 'photo-puzzle' },
    update: {},
    create: {
      name: 'Custom Photo Puzzle',
      slug: 'photo-puzzle',
      description:
        'Turn your favorite photo into a fun puzzle! Perfect for family activities and a unique way to display memories.',
      categoryId: categories[2].id,
      basePrice: 24.99,
      images: ['/images/products/puzzle-1.jpg'],
      bestseller: true,
      variants: {
        create: [
          { name: '100 Pieces', sku: 'PZ-100', priceModifier: 0, stock: 999 },
          { name: '500 Pieces', sku: 'PZ-500', priceModifier: 10, stock: 999 },
          { name: '1000 Pieces', sku: 'PZ-1000', priceModifier: 15, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          {
            fieldName: 'photo',
            fieldType: 'image',
            label: 'Upload Photo',
            required: true,
          },
          {
            fieldName: 'boxText',
            fieldType: 'text',
            label: 'Custom Box Text',
            placeholder: 'Optional text for puzzle box',
            required: false,
          },
        ],
      },
    },
  });

  // Star Necklace
  await prisma.product.upsert({
    where: { slug: 'star-map-necklace' },
    update: {},
    create: {
      name: 'Star Map Necklace',
      slug: 'star-map-necklace',
      description:
        'Wear the stars of your special moment. A beautiful necklace featuring a custom star map engraved on a delicate pendant.',
      categoryId: categories[3].id,
      basePrice: 79.99,
      images: ['/images/products/necklace-1.jpg'],
      featured: true,
      variants: {
        create: [
          { name: 'Gold 45cm', sku: 'NL-GOLD-45', material: 'Gold', priceModifier: 0, stock: 999 },
          { name: 'Gold 50cm', sku: 'NL-GOLD-50', material: 'Gold', priceModifier: 5, stock: 999 },
          { name: 'Silver 45cm', sku: 'NL-SILVER-45', material: 'Silver', priceModifier: -10, stock: 999 },
          { name: 'Silver 50cm', sku: 'NL-SILVER-50', material: 'Silver', priceModifier: -5, stock: 999 },
          { name: 'Rose Gold 45cm', sku: 'NL-ROSE-45', material: 'Rose Gold', priceModifier: 5, stock: 999 },
          { name: 'Rose Gold 50cm', sku: 'NL-ROSE-50', material: 'Rose Gold', priceModifier: 10, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          { fieldName: 'date', fieldType: 'date', label: 'Special Date', required: true },
          { fieldName: 'location', fieldType: 'location', label: 'Location', required: true },
        ],
      },
    },
  });

  // Song Display
  await prisma.product.upsert({
    where: { slug: 'spotify-song-display' },
    update: {},
    create: {
      name: 'Spotify Song Display',
      slug: 'spotify-song-display',
      description:
        'Showcase your favorite song with album art and a scannable Spotify code. A perfect gift for music lovers!',
      categoryId: categories[4].id,
      basePrice: 27.99,
      images: ['/images/products/song-display-1.jpg'],
      bestseller: true,
      variants: {
        create: [
          { name: 'A4 Poster', sku: 'SD-A4-POSTER', size: 'A4', material: 'Poster', priceModifier: 0, stock: 999 },
          { name: 'A3 Poster', sku: 'SD-A3-POSTER', size: 'A3', material: 'Poster', priceModifier: 10, stock: 999 },
          { name: 'A4 Framed', sku: 'SD-A4-FRAMED', size: 'A4', material: 'Framed', priceModifier: 40, stock: 999 },
        ],
      },
      customizationFields: {
        create: [
          {
            fieldName: 'spotifyUrl',
            fieldType: 'text',
            label: 'Spotify Song URL',
            placeholder: 'Paste Spotify song link',
            required: true,
          },
          {
            fieldName: 'colorTheme',
            fieldType: 'select',
            label: 'Color Theme',
            options: { values: ['black', 'white', 'green', 'blue', 'pink'] },
            required: true,
          },
          {
            fieldName: 'customText',
            fieldType: 'text',
            label: 'Custom Text',
            placeholder: 'Optional message',
            required: false,
          },
        ],
      },
    },
  });

  console.log('✅ Created products with variants and customization fields');

  // Create sample coupons
  console.log('Creating sample coupons...');
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      discountType: 'percentage',
      discountValue: 10,
      minPurchase: 0,
      maxDiscount: 50,
      usageLimit: 1000,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      description: 'Free shipping on orders over €30',
      discountType: 'fixed',
      discountValue: 4.95,
      minPurchase: 30,
      validFrom: new Date(),
      active: true,
    },
  });

  console.log('✅ Created sample coupons');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
