import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/libs/prisma";
import monoService from "@/services/mono"; // Corrected import

/**
 * POST /api/v1/accounts/link
 * Links a bank account using Mono
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      // Check for user.id as well
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Missing required field: code" },
        { status: 400 }
      );
    }

    console.log(`[Link Account] Received code for user ${userId}`);

    // Exchange code for account ID
    const auth = await monoService.exchangeToken(code as string);
    const monoAccountId = auth.id; // This is the ID from Mono, often referred to as account_id
    console.log(
      `[Link Account] Exchanged code for Mono Account ID: ${monoAccountId}`
    );

    // Get account details
    const { account: monoAccountDetails, meta: monoAccountMeta } =
      await monoService.getAccountDetails(monoAccountId);
    console.log(
      `[Link Account] Fetched Mono Account Details for ${monoAccountId}`
    );

    // Get account identity (e.g., BVN, full name)
    // Ensure your MonoAccount interface and Prisma schema can store these if needed.
    let monoAccountIdentity;
    try {
      monoAccountIdentity = await monoService.getAccountIdentity(monoAccountId);
      console.log(
        `[Link Account] Fetched Mono Account Identity for ${monoAccountId}`
      );
    } catch (identityError) {
      console.warn(
        `[Link Account] Could not fetch identity for Mono Account ID ${monoAccountId}:`,
        identityError
      );
      // Decide if this is a critical error or if you can proceed without identity.
      // For now, we'll proceed but log it.
    }

    // Check if this account (identified by monoAccountId) already exists for this user
    const existingAccount = await prisma.bankAccount.findFirst({
      where: {
        monoId: monoAccountId, // monoId in your schema should store monoAccountId from Mono
        userId: userId,
      },
    });

    let appAccount; // This will be our application's bank account record

    if (existingAccount) {
      console.log(
        `[Link Account] Account ${monoAccountId} already exists for user ${userId}. Updating.`
      );
      // Update existing account
      appAccount = await prisma.bankAccount.update({
        where: { id: existingAccount.id },
        data: {
          balance: monoAccountDetails.balance / 100, // Convert from kobo
          // monoAccessToken: code as string, // Storing the initial short-lived code. Consider if needed.
          // The primary link is monoId.
          lastSynced: new Date(),
          status: "ACTIVE", // Or based on monoAccountMeta.data_status
          monoDataStatus: monoAccountMeta?.data_status,
          // Update other fields if necessary, e.g., from monoAccountIdentity
          ...(monoAccountIdentity?.bvn && { bvn: monoAccountIdentity.bvn }),
        },
      });
      console.log(
        `[Link Account] Updated existing account ID: ${appAccount.id}`
      );
    } else {
      console.log(
        `[Link Account] Account ${monoAccountId} is new for user ${userId}. Creating.`
      );
      // Create new bank account record
      appAccount = await prisma.bankAccount.create({
        data: {
          userId: userId,
          accountName:
            monoAccountDetails.name ||
            `${monoAccountDetails.institution.name} Account`,
          accountNumber: monoAccountDetails.accountNumber || "N/A",
          bankName: monoAccountDetails.institution.name,
          balance: monoAccountDetails.balance / 100, // Convert from kobo
          currency: monoAccountDetails.currency,
          monoId: monoAccountId, // Store the main ID from Mono here
          // monoAccountId: monoAccountDetails.id, // This is the same as monoAccountId from exchangeToken. Redundant if monoId is set.
          // monoAccessToken: code as string, // Store the initial code if needed for some specific short-term purpose
          lastSynced: new Date(),
          status: "ACTIVE", // Or based on monoAccountMeta.data_status
          monoDataStatus: monoAccountMeta?.data_status,
          authMethod: monoAccountMeta?.auth_method,
          // Store identity info if available and schema supports
          ...(monoAccountIdentity?.bvn && { bvn: monoAccountIdentity.bvn }),
          ...(monoAccountIdentity?.fullName && {
            accountHolderName: monoAccountIdentity.fullName,
          }),
        },
      });
      console.log(`[Link Account] Created new account ID: ${appAccount.id}`);
    }

    // Start initial data sync in the background (no await here, it runs independently)
    syncInitialTransactions(monoAccountId, appAccount.id, userId)
      .then(() =>
        console.log(
          `[Link Account] Initial transaction sync process started for app account ${appAccount.id}`
        )
      )
      .catch((err) =>
        console.error(
          `[Link Account] Error starting initial transaction sync for ${appAccount.id}:`,
          err
        )
      );

    return NextResponse.json(
      {
        message: existingAccount
          ? "Account updated successfully"
          : "Account linked successfully",
        account: {
          id: appAccount.id,
          name: appAccount.accountName,
          bankName: appAccount.bankName,
          balance: appAccount.balance,
          currency: appAccount.currency,
          monoId: appAccount.monoId,
        },
      },
      { status: existingAccount ? 200 : 201 }
    );
  } catch (error: any) {
    console.error(
      "[Link Account] Error linking account:",
      error.response?.data || error.message,
      error.stack
    );
    // Check if it's a known Mono error structure
    if (error.response?.data?.message) {
      return NextResponse.json(
        {
          error: "Failed to link account with Mono",
          message: error.response.data.message,
        },
        { status: error.response.status || 500 }
      );
    }
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
  monoApiAccountId: string, // ID from Mono API (the one used to fetch data from Mono)
  internalAccountId: string, // Your application's database ID for the bank account
  userId: string
) {
  console.log(
    `[Sync Transactions] Starting initial sync for Mono Account ID ${monoApiAccountId}, App Account ID ${internalAccountId}`
  );
  try {
    // Get transactions from the last 3 months (or preferred period)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    // Format dates as YYYY-MM-DD or DD-MM-YYYY as required by Mono
    // Mono typically expects DD-MM-YYYY for start/end in query params
    const formatDateForMono = (date: Date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const startDate = formatDateForMono(threeMonthsAgo);
    const endDate = formatDateForMono(new Date());

    console.log(
      `[Sync Transactions] Fetching transactions for ${monoApiAccountId} from ${startDate} to ${endDate}`
    );

    // Get transactions from Mono API
    // The monoService.getAccountTransactions might return a paginated response.
    // Handle pagination if necessary to get all transactions.
    // For simplicity, assuming it returns all within the limit or we handle one page.
    const transactionResponse = await monoService.getAccountTransactions(
      monoApiAccountId,
      {
        start: startDate,
        end: endDate,
        // paginate: true, // If your service method supports this param directly
        limit: 500, // Max limit often 500 for Mono. Adjust as needed.
      }
    );

    const transactionsFromMono = transactionResponse.data; // Assuming .data holds the array

    if (!transactionsFromMono || transactionsFromMono.length === 0) {
      console.log(
        `[Sync Transactions] No transactions found for Mono Account ID ${monoApiAccountId} in the period.`
      );
      // Update last synced even if no transactions
      await prisma.bankAccount.update({
        where: { id: internalAccountId },
        data: { lastSynced: new Date(), status: "SYNCED" }, // Mark as SYNCED
      });
      return;
    }

    console.log(
      `[Sync Transactions] Received ${transactionsFromMono.length} transactions for Mono Account ID ${monoApiAccountId}. Processing...`
    );
    let newTransactionsCount = 0;

    for (const tx of transactionsFromMono) {
      // Check if transaction already exists to avoid duplicates using monoTransactionId
      const existingTransaction = await prisma.transaction.findUnique({
        where: {
          monoTransactionId: tx._id, // Assuming your schema has monoTransactionId @unique
        },
      });

      if (existingTransaction) {
        // console.log(`[Sync Transactions] Transaction ${tx._id} already exists. Skipping.`);
        continue;
      }
      newTransactionsCount++;

      const txType = tx.type.toUpperCase() === "CREDIT" ? "INCOME" : "EXPENSE";

      await prisma.transaction.create({
        data: {
          userId: userId,
          bankAccountId: internalAccountId, // Link to your internal bank account ID
          amount: Math.abs(tx.amount) / 100, // Convert from kobo & ensure positive
          type: txType,
          narration: tx.narration, // Changed from 'description' to 'narration' to match Mono
          category: tx.category, // Ensure your Transaction model has 'category'
          date: new Date(tx.date),
          balanceAfter: tx.balance ? tx.balance / 100 : undefined, // Convert from kobo
          monoTransactionId: tx._id, // Store Mono's transaction ID
          // metadata: tx as any, // Store the whole tx object if needed, ensure Prisma schema supports Json type
        },
      });
    }

    // Update account last synced timestamp and status
    await prisma.bankAccount.update({
      where: { id: internalAccountId },
      data: { lastSynced: new Date(), status: "SYNCED" }, // Mark as SYNCED
    });

    console.log(
      `[Sync Transactions] Synced ${newTransactionsCount} new transactions for App Account ID ${internalAccountId} (Mono ID: ${monoApiAccountId})`
    );
  } catch (error: any) {
    console.error(
      `[Sync Transactions] Error syncing initial transactions for App Account ID ${internalAccountId} (Mono ID: ${monoApiAccountId}):`,
      error.response?.data || error.message,
      error.stack
    );
    // Optionally update account status to indicate sync failure
    try {
      await prisma.bankAccount.update({
        where: { id: internalAccountId },
        data: { status: "SYNC_FAILED" },
      });
    } catch (dbError) {
      console.error(
        `[Sync Transactions] Failed to update account status to SYNC_FAILED for ${internalAccountId}:`,
        dbError
      );
    }
  }
}
