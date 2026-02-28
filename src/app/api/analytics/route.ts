import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "CHEF") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const notCancelled = { status: { not: "CANCELLED" as const } };

  const [totalOrders, todayOrders, monthOrders, statusCounts, recentOrders, topItems] =
    await Promise.all([
      prisma.order.count({ where: notCancelled }),
      prisma.order.count({ where: { createdAt: { gte: todayStart }, ...notCancelled } }),
      prisma.order.aggregate({
        where: { createdAt: { gte: thisMonthStart }, ...notCancelled },
        _sum: { total: true },
        _count: true,
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),
      // Orders per day for the last 14 days (excluding cancelled)
      prisma.$queryRaw<{ day: string; count: bigint; revenue: number }[]>`
        SELECT
          DATE("createdAt") as day,
          COUNT(*) as count,
          SUM(total) as revenue
        FROM "Order"
        WHERE "createdAt" >= NOW() - INTERVAL '14 days'
          AND status::text != 'CANCELLED'
        GROUP BY DATE("createdAt")
        ORDER BY day ASC
      `,
      // Top selling items (excluding cancelled orders)
      prisma.$queryRaw<{ name: string; total_qty: bigint }[]>`
        SELECT m.name, SUM(oi.quantity) as total_qty
        FROM "OrderItem" oi
        JOIN "MenuItem" m ON oi."menuItemId" = m.id
        JOIN "Order" o ON oi."orderId" = o.id
        WHERE o.status::text != 'CANCELLED'
        GROUP BY m.name
        ORDER BY total_qty DESC
        LIMIT 5
      `,
    ]);

  const totalRevenue = await prisma.order.aggregate({
    where: notCancelled,
    _sum: { total: true },
  });
  const avgOrderValue =
    totalOrders > 0 ? (totalRevenue._sum.total ?? 0) / totalOrders : 0;

  return NextResponse.json({
    totalOrders,
    todayOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    monthRevenue: monthOrders._sum.total ?? 0,
    monthOrders: monthOrders._count,
    avgOrderValue,
    statusCounts: statusCounts.reduce(
      (acc, s) => ({ ...acc, [s.status]: s._count.status }),
      {} as Record<string, number>
    ),
    recentOrders: recentOrders.map((r) => ({
      day: r.day,
      count: Number(r.count),
      revenue: Number(r.revenue),
    })),
    topItems: topItems.map((t) => ({
      name: t.name,
      totalQty: Number(t.total_qty),
    })),
  });
}
