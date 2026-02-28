import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: {
      menuItem: { select: { name: true, price: true, imageUrl: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const items = cartItems.map((c) => ({
    menuItemId: c.menuItemId,
    quantity: c.quantity,
    name: c.menuItem.name,
    price: c.menuItem.price,
    imageUrl: c.menuItem.imageUrl,
  }));

  return NextResponse.json({ items });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CLIENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { items } = await req.json() as {
    items: { menuItemId: string; quantity: number }[];
  };

  const userId = session.user.id;

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId } }),
    ...(items.length > 0
      ? [prisma.cartItem.createMany({
          data: items.map((i) => ({
            userId,
            menuItemId: i.menuItemId,
            quantity: i.quantity,
          })),
        })]
      : []),
  ]);

  return NextResponse.json({ ok: true });
}
