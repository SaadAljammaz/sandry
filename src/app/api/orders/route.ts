import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const isChef = session.user.role === "CHEF";

  const where = {
    ...(isChef ? {} : { clientId: session.user.id }),
    ...(status ? { status: status as never } : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    include: {
      client: { select: { id: true, name: true, deletedAt: true } },
      items: {
        include: { menuItem: { select: { id: true, name: true, imageUrl: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (isChef && status) {
    return NextResponse.json({ count: orders.length, orders });
  }

  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { items, total, notes } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });
  }

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        clientId: session.user.id,
        total: Number(total),
        notes,
        items: {
          create: items.map((item: { menuItemId: string; quantity: number; unitPrice: number }) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: { include: { menuItem: true } },
      },
    }),
    prisma.cartItem.deleteMany({ where: { userId: session.user.id } }),
  ]);

  return NextResponse.json(order, { status: 201 });
}
