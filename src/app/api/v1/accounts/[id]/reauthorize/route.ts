import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";
import monoService from "@/services/mono"; // Corrected import path

/**
 * POST /api/v1/accounts/:id/reauthorize
 * Reauthorizes a bank account connection with Mono
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accountId = params.id;

    // Get account from database
    const bankAccount = await prisma.bankAccount.findFirst({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    });

    if (!bankAccount) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!bankAccount.monoId) {
      return NextResponse.json(
        { error: "Account not linked with Mono" },
        { status: 400 }
      );
    }

    // Get reauthorization token from Mono
    const reauth = await monoService.reauthorizeAccount(bankAccount.monoId);

    // Update bank account with reauthorization token
    await prisma.bankAccount.update({
      where: { id: accountId },
      data: {
        monoReauthToken: reauth.token,
      },
    });

    return NextResponse.json({
      token: reauth.token,
    });
  } catch (error: any) {
    console.error("Error reauthorizing account:", error);

    return NextResponse.json(
      {
        error: "Failed to reauthorize account",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
