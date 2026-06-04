import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit, getClientIp, rateLimitResponse } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

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
          error: 'This email is already subscribed to our newsletter',
        },
        { status: 400 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.newsletter.create({
      data: {
        email: validatedData.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
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

