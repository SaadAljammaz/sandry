import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHEF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["PENDING", "IN_PROGRESS", "READY", "DELIVERED", "CANCELLED"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      client: { select: { id: true, name: true, email: true, deletedAt: true } },
      items: { include: { menuItem: { select: { id: true, name: true } } } },
    },
  });

  return NextResponse.json(order);
}

// Client can update quantities/notes on their own PENDING orders
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { items, notes } = await req.json() as {
    items: { id: string; quantity: number }[];
    notes?: string;
  };

  // Load the order and verify ownership + status
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.clientId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (order.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending orders can be edited" }, { status: 400 });
  }

  // Keep only items with quantity > 0
  const validItems = items.filter((i) => i.quantity > 0);
  if (validItems.length === 0) {
    return NextResponse.json({ error: "Order must have at least one item" }, { status: 400 });
  }

  // Recalculate total using original unit prices
  const newTotal = validItems.reduce((sum, i) => {
    const original = order.items.find((oi) => oi.id === i.id);
    return sum + (original?.unitPrice ?? 0) * i.quantity;
  }, 0);

  // Replace items and update total/notes in a transaction
  await prisma.$transaction([
    prisma.orderItem.deleteMany({ where: { orderId: id } }),
    prisma.orderItem.createMany({
      data: validItems.map((i) => {
        const original = order.items.find((oi) => oi.id === i.id)!;
        return {
          orderId: id,
          menuItemId: original.menuItemId,
          quantity: i.quantity,
          unitPrice: original.unitPrice,
        };
      }),
    }),
    prisma.order.update({
      where: { id },
      data: {
        total: newTotal,
        notes: notes !== undefined ? notes : order.notes,
      },
    }),
  ]);

  const updated = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { menuItem: { select: { id: true, name: true, imageUrl: true } } } },
    },
  });

  return NextResponse.json(updated);
}
