import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
}).refine(
  (data) => !data.newPassword || data.currentPassword,
  { message: "Current password required to set a new one", path: ["currentPassword"] }
);

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }

  const { name, currentPassword, newPassword } = parsed.data;
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Password change
  if (newPassword) {
    if (!user.password) {
      return NextResponse.json({ error: "Account uses social login, cannot set password" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword!, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
  }

  const updateData: any = {};
  if (name) updateData.name = name;
  if (newPassword) updateData.password = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({ where: { id: user.id }, data: updateData });

  return NextResponse.json({ success: true });
}
