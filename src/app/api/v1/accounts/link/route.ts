import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";
import monoService from "@/libs/mono";

/**
 * POST /api/v1/accounts/link
 * Links a bank account using Mono
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Missing required field: code" },
        { status: 400 }
      );
    }

    // Exchange code for account ID
    const auth = await monoService.exchangeToken(code);
    const accountId = auth.id;

    // Get account details
    const { account } = await monoService.getAccountDetails(accountId);

    // Check if this account already exists for this user
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        monoId: accountId,
        userId: session.user.id,
      },
    });

    if (existingAccount) {
      // Update existing account
      const updatedAccount = await prisma.bankAccount.update({
        where: { id: existingAccount.id },
        data: {
          balance: account.balance / 100, // Convert from kobo to Naira
          monoAccessToken: code, // Store the most recent access token
          lastSynced: new Date(),
        },
      });

      return NextResponse.json({
        message: "Account updated successfully",
        account: {
          id: updatedAccount.id,
          name: updatedAccount.accountName,
          bankName: updatedAccount.bankName,
          balance: updatedAccount.balance,
          currency: updatedAccount.currency,
        },
      });
    }

    // Create new bank account record
    const newAccount = await prisma.bankAccount.create({
      data: {
        userId: session.user.id,
        accountName: account.name || `${account.institution.name} Account`,
        accountNumber: account.accountNumber || "",
        bankName: account.institution.name,
        balance: account.balance / 100, // Convert from kobo to Naira
        currency: account.currency,
        monoId: accountId,
        monoAccountId: account.id,
        monoAccessToken: code,
        lastSynced: new Date(),
      },
    });

    // Start initial data sync in the background
    syncInitialTransactions(accountId, newAccount.id, session.user.id).catch(
      console.error
    );

    return NextResponse.json(
      {
        message: "Account linked successfully",
        account: {
          id: newAccount.id,
          name: newAccount.accountName,
          bankName: newAccount.bankName,
          balance: newAccount.balance,
          currency: newAccount.currency,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error linking account:", error);

    return NextResponse.json(
      {
        error: "Failed to link account",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * Background function to sync initial transactions from Mono
 */
async function syncInitialTransactions(
  monoAccountId: string,
  accountId: string,
  userId: string
) {
  try {
    // Get transactions from the last 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const startDate = threeMonthsAgo.toISOString();
    const endDate = new Date().toISOString();

    // Get transactions from Mono API
    const transactions = await monoService.getTransactions(monoAccountId, {
      start: startDate,
      end: endDate,
      paginate: true,
      limit: 100, // Adjust this based on expected volume
    });

    if (!transactions.data || transactions.data.length === 0) return;

    // Process each transaction
    for (const tx of transactions.data) {
      // Check if transaction already exists to avoid duplicates
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          externalId: tx._id,
          userId,
        },
      });

      if (existingTransaction) continue;

      // Determine transaction type
      const txType = tx.type.toUpperCase() === "CREDIT" ? "INCOME" : "EXPENSE";

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          accountId,
          amount: Math.abs(tx.amount) / 100, // Convert from kobo to Naira and ensure positive
          type: txType,
          description: tx.narration,
          category: tx.category,
          date: new Date(tx.date),
          balance: tx.balance ? tx.balance / 100 : undefined, // Convert from kobo to Naira
          externalId: tx._id,
          metadata: tx as any,
        },
      });
    }

    // Update account last synced timestamp
    await prisma.bankAccount.update({
      where: { id: accountId },
      data: { lastSynced: new Date() },
    });

    console.log(
      `Synced ${transactions.data.length} transactions for account ${accountId}`
    );
  } catch (error) {
    console.error(
      `Error syncing initial transactions for account ${accountId}:`,
      error
    );
  }
}
