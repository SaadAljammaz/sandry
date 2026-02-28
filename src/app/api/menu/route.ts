import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHEF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { name, description, price, costPrice, category, imageUrl, available } = await req.json();

  if (!name || !price || !category) {
    return NextResponse.json({ error: "name, price, and category are required" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      name, description, price: Number(price),
      costPrice: costPrice !== undefined ? Number(costPrice) : 0,
      category, imageUrl, available: available ?? true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
