import { NextRequest, NextResponse } from "next/server";

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit({ key, limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { limited: true, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { limited: false, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function rateLimitResponse(resetAt: number) {
  return NextResponse.json(
    { success: false, error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)).toString(),
      },
    }
  );
}
