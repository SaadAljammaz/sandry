import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Protect OWNER accounts from being modified
  if (target.role === "OWNER") {
    return NextResponse.json({ error: "Cannot modify owner accounts" }, { status: 403 });
  }

  const { role, active } = await req.json();

  const data: { role?: Role; active?: boolean } = {};
  if (role !== undefined) {
    if (role !== "CHEF" && role !== "CLIENT") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    data.role = role as Role;
  }
  if (active !== undefined) {
    // Prevent the owner from deactivating themselves
    if (id === session.user.id) {
      return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
    }
    data.active = active;
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (target.role === "OWNER") {
    return NextResponse.json({ error: "Cannot delete owner accounts" }, { status: 403 });
  }

  // Soft-delete: keep orders and purchases intact for history
  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: id } }),
    prisma.user.update({ where: { id }, data: { deletedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
