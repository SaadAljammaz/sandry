import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const chefId = searchParams.get("chefId") || undefined;

  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);
  thisMonthStart.setHours(0, 0, 0, 0);

  const where = chefId ? { chefId } : {};

  const [purchases, allTimeAgg, monthAgg, chefs] = await Promise.all([
    prisma.purchase.findMany({
      where,
      orderBy: { purchasedAt: "desc" },
      include: {
        chef: { select: { id: true, name: true } },
      },
    }),
    prisma.purchase.aggregate({ where, _sum: { amount: true } }),
    prisma.purchase.aggregate({
      where: { ...where, purchasedAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
    prisma.user.findMany({
      where: { role: "CHEF", deletedAt: null },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return NextResponse.json({
    purchases,
    allTimeTotal: allTimeAgg._sum.amount ?? 0,
    monthTotal: monthAgg._sum.amount ?? 0,
    chefs,
  });
}
