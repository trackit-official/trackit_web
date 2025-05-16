import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust if your authOptions path is different
import prisma from "@/libs/prisma";
import monoService from "@/services/monoService";
import { monoPublicKey } from "@/config/monoConfig";

/**
 * GET /api/mono/config
 * Fetches the Mono public key and other necessary frontend config.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // You can add more dynamic configuration if needed, e.g., user-specific data for Mono
    return NextResponse.json({ publicKey: monoPublicKey });
  } catch (error: any) {
    console.error("Error fetching Mono config:", error);
    return NextResponse.json(
      { error: "Failed to fetch Mono configuration", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/mono/exchange-token
 * Exchanges a public token from Mono Connect for an account ID and saves the account.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const { public_token: monoCode } = await request.json();

    if (!monoCode) {
      return NextResponse.json(
        { error: "Missing public_token (monoCode)" },
        { status: 400 }
      );
    }

    // 1. Exchange code for Mono Account ID
    const monoAccountId = await monoService.getAccountId(monoCode);

    // 2. Get account information (includes institution, account number, name, type, currency, etc.)
    const accountInfo = await monoService.getAccountInformation(monoAccountId);
    // 3. Get identity information (BVN, etc.)
    const identityInfo = await monoService.getIdentity(monoAccountId);

    // 4. Check if this Mono account already exists for this user to prevent duplicates
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        userId: userId,
        monoId: monoAccountId,
      },
    });

    if (existingAccount) {
      // Account already linked, maybe update its status or last synced time
      const updatedAccount = await prisma.bankAccount.update({
        where: { id: existingAccount.id },
        data: {
          status: "ACTIVE",
          lastSynced: new Date(),
          monoDataStatus: accountInfo.meta?.data_status || "AVAILABLE",
        },
      });
      return NextResponse.json({
        message: "Account already linked and updated.",
        account: updatedAccount,
      });
    }

    // 5. Create a new BankAccount record in your database
    const newBankAccount = await prisma.bankAccount.create({
      data: {
        userId: userId,
        monoId: monoAccountId,
        accountName:
          accountInfo.account?.name || accountInfo.name || "Unknown Account",
        accountNumber: accountInfo.account?.accountNumber, // ensure this path is correct
        bankName: accountInfo.institution?.name || "Unknown Bank",
        balance: (accountInfo.account?.balance || 0) / 100, // Assuming kobo/cents
        currency: accountInfo.account?.currency || "NGN",
        isActive: true,
        status: "ACTIVE", // Initial status
        monoDataStatus: accountInfo.meta?.data_status || "PROCESSING", // Or "AVAILABLE" if confirmed
        authMethod: accountInfo.meta?.auth_method,
        accountHolderName: identityInfo?.name, // from identity endpoint
        bvn: identityInfo?.bvn, // from identity endpoint
        lastSynced: new Date(),
      },
    });

    // 6. Optionally, trigger an initial transaction sync (or rely on webhooks)
    // await monoService.triggerDataSync(monoAccountId);
    // Or fetch initial transactions directly:
    // const transactions = await monoService.getAccountTransactions(monoAccountId, { limit: 30 });
    // Then save these transactions (similar to webhook handler)

    return NextResponse.json({
      message: "Account linked successfully",
      account: newBankAccount,
    });
  } catch (error: any) {
    console.error("Error exchanging Mono token:", error);
    // Check if it's a known error from monoService or a generic one
    const errorMessage = error.message || "Failed to link account with Mono.";
    return NextResponse.json(
      { error: errorMessage, details: error.response?.data }, // Include details if available from Mono
      { status: 500 }
    );
  }
}
