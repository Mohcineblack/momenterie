import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

function generateCouponCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'BIENVENUE-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit({
      key: `newsletter:${getClientIp(request)}`,
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });

    if (rateLimit.limited) {
      return rateLimitResponse(rateLimit.resetAt);
    }

    const body = await request.json();
    const validatedData = newsletterSchema.parse(body);

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email: validatedData.email },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cet email est déjà inscrit à notre newsletter',
        },
        { status: 400 }
      );
    }

    // Create subscriber + first-order coupon in a transaction
    const couponCode = generateCouponCode();

    const [subscriber] = await prisma.$transaction([
      prisma.newsletter.create({
        data: { email: validatedData.email },
      }),
      prisma.coupon.create({
        data: {
          code: couponCode,
          description: `Newsletter welcome - ${validatedData.email}`,
          discountType: 'percentage',
          discountValue: 5,
          usageLimit: 1,
          usageCount: 0,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          active: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie !',
      couponCode,
      data: subscriber,
    });
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.errors[0]?.message || 'Invalid email address',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

