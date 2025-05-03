import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";

/**
 * GET /api/v1/transactions
 * Returns transactions for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") as string)
      : new Date();
    const accountId = searchParams.get("accountId");
    const category = searchParams.get("category");
    const type = searchParams.get("type");

    // Build query filters
    const filters = {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(accountId && { accountId }),
      ...(category && { category }),
      ...(type && { type }),
    };

    // Count total matching transactions for pagination
    const total = await prisma.transaction.count({ where: filters });

    // Fetch transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: filters,
      orderBy: {
        date: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
            bankName: true,
            currency: true,
          },
        },
      },
    });

    // Get aggregated data for this period
    const aggregations = await prisma.$transaction([
      // Total income for period
      prisma.transaction.aggregate({
        where: {
          ...filters,
          type: "INCOME",
        },
        _sum: {
          amount: true,
        },
      }),
      // Total expenses for period
      prisma.transaction.aggregate({
        where: {
          ...filters,
          type: "EXPENSE",
        },
        _sum: {
          amount: true,
        },
      }),
      // Categories with totals for expenses
      prisma.transaction.groupBy({
        by: ["category"],
        where: {
          ...filters,
          type: "EXPENSE",
          category: { not: null },
        },
        _sum: {
          amount: true,
        },
        orderBy: {
          _sum: {
            amount: "desc",
          },
        },
        take: 5,
      }),
    ]);

    const totalIncome = aggregations[0]._sum.amount || 0;
    const totalExpenses = aggregations[1]._sum.amount || 0;
    const topCategories = aggregations[2].map((item) => ({
      category: item.category,
      amount: item._sum.amount || 0,
    }));

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      summary: {
        totalIncome,
        totalExpenses,
        netFlow: totalIncome - totalExpenses,
        topCategories,
      },
    });
  } catch (error: any) {
    console.error("Error fetching transactions:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
