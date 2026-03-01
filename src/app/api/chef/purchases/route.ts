import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHEF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chefId = session.user.id;
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const [purchases, allTimeAgg, monthAgg] = await Promise.all([
    prisma.purchase.findMany({
      where: { chefId },
      orderBy: { purchasedAt: "desc" },
    }),
    prisma.purchase.aggregate({
      where: { chefId },
      _sum: { amount: true },
    }),
    prisma.purchase.aggregate({
      where: { chefId, purchasedAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
  ]);

  return NextResponse.json({
    purchases,
    allTimeTotal: allTimeAgg._sum.amount ?? 0,
    monthTotal: monthAgg._sum.amount ?? 0,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHEF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { description, amount, purchasedAt, receiptImage } = await req.json();

  if (!description || !amount || !purchasedAt) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const parsedAmount = Number(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
  }

  const purchase = await prisma.purchase.create({
    data: {
      description,
      amount: parsedAmount,
      purchasedAt: new Date(purchasedAt),
      chefId: session.user.id,
      receiptImage: receiptImage ?? null,
    },
  });

  return NextResponse.json(purchase, { status: 201 });
}
