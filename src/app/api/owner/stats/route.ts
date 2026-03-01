import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId") || null;
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const fromDate = fromParam ? new Date(fromParam) : null;
  const toDate = toParam
    ? (() => { const d = new Date(toParam); d.setHours(23, 59, 59, 999); return d; })()
    : null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // ── Prisma WHERE for all filtered order queries ─────────────────────────────
  const filteredWhere = {
    status: { not: "CANCELLED" as const },
    ...(clientId ? { clientId: clientId } : {}),
    ...(fromDate || toDate
      ? { createdAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } }
      : {}),
  };

  // "This month" and "today" always use their own date range but respect clientId
  const notCancelled = { status: { not: "CANCELLED" as const } };
  const monthWhere = { ...notCancelled, createdAt: { gte: thisMonthStart }, ...(clientId ? { clientId: clientId } : {}) };
  const todayWhere = { ...notCancelled, createdAt: { gte: todayStart }, ...(clientId ? { clientId: clientId } : {}) };

  // ── Raw SQL filter fragments (PostgreSQL — camelCase columns must be quoted) ─
  const clientSql = clientId ? Prisma.sql`AND o."clientId" = ${clientId}` : Prisma.sql``;
  const fromSql   = fromDate ? Prisma.sql`AND o."createdAt" >= ${fromDate}` : Prisma.sql``;
  const toSql     = toDate   ? Prisma.sql`AND o."createdAt" <= ${toDate}`   : Prisma.sql``;

  // recentDays: use selected from date, or default to last 14 days
  const recentFrom = fromDate ?? new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const recentToSql = toDate ? Prisma.sql`AND o."createdAt" <= ${toDate}` : Prisma.sql``;

  const [
    totalOrders,
    todayOrders,
    monthAgg,
    statusCounts,
    totalClients,
    newClientsThisMonth,
    recentDays,
    topItems,
    totalAgg,
  ] = await Promise.all([
    prisma.order.count({ where: filteredWhere }),
    prisma.order.count({ where: todayWhere }),
    prisma.order.aggregate({ where: monthWhere, _sum: { total: true }, _count: true }),
    prisma.order.groupBy({ by: ["status"], where: filteredWhere, _count: { status: true } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.user.count({ where: { role: "CLIENT", createdAt: { gte: thisMonthStart } } }),

    // Revenue per day for selected range
    prisma.$queryRaw<{ day: string; orders: bigint; revenue: number }[]>`
      SELECT
        DATE(o."createdAt") as day,
        COUNT(DISTINCT o.id) as orders,
        SUM(DISTINCT o.total) as revenue
      FROM "Order" o
      WHERE o."createdAt" >= ${recentFrom}
        ${recentToSql}
        AND o.status::text != 'CANCELLED'
        ${clientSql}
      GROUP BY DATE(o."createdAt")
      ORDER BY day ASC
    `,

    // Top 5 items by revenue
    prisma.$queryRaw<{ name: string; total_qty: bigint; revenue: number }[]>`
      SELECT
        m.name,
        SUM(oi.quantity) as total_qty,
        SUM(oi."unitPrice" * oi.quantity) as revenue
      FROM "OrderItem" oi
      JOIN "MenuItem" m ON oi."menuItemId" = m.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o.status::text != 'CANCELLED'
        ${fromSql}
        ${toSql}
        ${clientSql}
      GROUP BY m.name
      ORDER BY revenue DESC
      LIMIT 5
    `,

    prisma.order.aggregate({ where: filteredWhere, _sum: { total: true } }),
  ]);

  const [purchasesAgg, monthPurchasesAgg] = await Promise.all([
    prisma.purchase.aggregate({
      _sum: { amount: true },
      ...(fromDate || toDate
        ? { where: { purchasedAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } } }
        : {}),
    }),
    prisma.purchase.aggregate({
      where: { purchasedAt: { gte: thisMonthStart } },
      _sum: { amount: true },
    }),
  ]);

  const totalRevenue = totalAgg._sum.total ?? 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalPurchases = Number(purchasesAgg._sum.amount ?? 0);
  const monthPurchases = Number(monthPurchasesAgg._sum.amount ?? 0);
  const actualProfit = totalRevenue - totalPurchases;
  const actualMonthProfit = Number(monthAgg._sum.total ?? 0) - monthPurchases;

  return NextResponse.json({
    totalRevenue,
    totalOrders,
    totalClients,
    monthRevenue: monthAgg._sum.total ?? 0,
    monthOrders: monthAgg._count,
    todayOrders,
    avgOrderValue,
    newClientsThisMonth,
    totalPurchases,
    monthPurchases,
    actualProfit,
    actualMonthProfit,
    statusCounts: statusCounts.reduce(
      (acc, s) => ({ ...acc, [s.status]: s._count.status }),
      {} as Record<string, number>
    ),
    recentDays: recentDays.map((r) => ({
      day: new Date(r.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      orders: Number(r.orders),
      revenue: Number(r.revenue),
    })),
    topItems: topItems.map((t) => ({
      name: t.name,
      totalQty: Number(t.total_qty),
      revenue: Number(t.revenue),
    })),
  });
}
