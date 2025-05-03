import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";

/**
 * GET /api/v1/accounts
 * Returns all bank accounts for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all accounts for the user
    const accounts = await prisma.bankAccount.findMany({
      where: {
        userId: session.user.id,
        isActive: true,
      },
      orderBy: {
        bankName: "asc",
      },
      select: {
        id: true,
        accountName: true,
        accountNumber: true,
        bankName: true,
        balance: true,
        currency: true,
        lastSynced: true,
        monoId: true,
      },
    });

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

    return NextResponse.json({
      accounts,
      totalBalance,
      count: accounts.length,
    });
  } catch (error: any) {
    console.error("Error fetching accounts:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch accounts",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
