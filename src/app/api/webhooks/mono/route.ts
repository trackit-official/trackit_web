import { NextRequest, NextResponse } from "next/server";
// Remove direct crypto import if monoService handles all of it
// import crypto from "crypto";
import prisma from "@/libs/prisma";
import monoService from "@/services/mono"; // Import the consolidated monoService

/**
 * POST /api/webhooks/mono
 * Handles webhook events from Mono
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("mono-webhook-signature"); // Corrected header name based on common patterns
    if (!signature) {
      console.warn("Webhook request missing mono-webhook-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Get the raw body as text for verification, then parse
    const rawBody = await request.text();

    // Verify the webhook signature using the service
    // The monoService.verifyWebhookSignature should implement the actual HMAC SHA512 logic.
    // For now, it uses the placeholder. THIS MUST BE UPDATED in monoService.
    const isValid = monoService.verifyWebhookSignature(signature, rawBody);
    if (!isValid) {
      console.warn("Webhook request with invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody); // Parse after successful verification
    const { event, data, meta } = body; // Destructure event and data, meta might also be present

    console.log(`Received Mono webhook event: ${event}`, { data, meta });

    // Handle different webhook events
    switch (event) {
      case "mono.events.account_updated": // This event might signify balance changes, status changes etc.
        await handleAccountUpdated(data);
        break;
      case "mono.events.account_reauthorized": // Event after successful reauthorization
        await handleAccountReauthorized(data);
        break;
      case "mono.events.reauthorisation_required": // Corrected spelling if Mono uses this
      case "mono.events.reauthorization_required": // Or this common spelling
        await handleReauthorisationRequired(data);
        break;
      case "mono.events.new_transaction": // If Mono has a specific event for new transactions
      case "mono.events.transactions_updated": // Or for batch updates
        await handleNewTransactions(data);
        break;
      case "mono.events.data_sync_completed": // Or a more specific name for data sync
      case "mono.events.data_sync": // Keeping original for now
        await handleDataSync(data);
        break;
      case "mono.events.account_unlinked":
        await handleAccountUnlinked(data);
        break;
      default:
        console.log(`Unhandled Mono webhook event: ${event}`, data);
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error(
      "Webhook processing error:",
      error.message,
      error.stack,
      await error.request?.text().catch(() => "")
    );
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle account updated event
 * This event can signify various updates like balance change, account status change, etc.
 */
async function handleAccountUpdated(data: any) {
  const accountId = data.account?._id || data.account_id || data._id; // Mono might use _id or account_id
  if (!accountId) {
    console.error(
      "handleAccountUpdated: Missing account_id in webhook data",
      data
    );
    return;
  }

  try {
    const updateData: any = {
      lastSynced: new Date(),
      // Potentially update other fields if provided in `data`
      // e.g., data_status from data.meta?.data_status
    };

    if (data.account?.balance !== undefined) {
      updateData.balance = data.account.balance; // Ensure this is the correct path and format (e.g., kobo/cents)
    }
    if (data.meta?.data_status) {
      updateData.monoDataStatus = data.meta.data_status;
    }
    if (data.account?.status) {
      // Mono might send an overall status for the account
      updateData.status =
        data.account.status === "active" ? "ACTIVE" : "NEEDS_ATTENTION"; // Map to your own status enum
    }

    const updatedAccount = await prisma.bankAccount.updateMany({
      // Use updateMany if monoId is not unique, or update if it is
      where: { monoId: accountId },
      data: updateData,
    });

    if (updatedAccount.count > 0) {
      console.log(`Account ${accountId} updated successfully via webhook.`);
    } else {
      console.warn(
        `handleAccountUpdated: No account found with monoId ${accountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update account ${accountId} from 'account_updated' webhook:`,
      error
    );
  }
}

/**
 * Handle account reauthorized event
 */
async function handleAccountReauthorized(data: any) {
  const accountId = data.account?._id || data.account_id || data._id;
  if (!accountId) {
    console.error(
      "handleAccountReauthorized: Missing account_id in webhook data",
      data
    );
    return;
  }

  try {
    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: accountId },
      data: {
        status: "ACTIVE", // Or "SYNCED", "CONNECTED"
        reauthToken: null, // Clear any reauth token
        lastSynced: new Date(),
        monoDataStatus: data.meta?.data_status || "AVAILABLE",
      },
    });
    if (updatedAccount.count > 0) {
      console.log(`Account ${accountId} marked as reauthorized and active.`);
      // Optionally, trigger a data sync or transaction fetch here
      // await monoService.syncAccount(accountId);
    } else {
      console.warn(
        `handleAccountReauthorized: No account found with monoId ${accountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update account ${accountId} from 'account_reauthorized' webhook:`,
      error
    );
  }
}

/**
 * Handle reauthorisation required event
 */
async function handleReauthorisationRequired(data: any) {
  const accountId = data.account?._id || data.account_id || data._id; // Mono might use _id or account_id
  if (!accountId) {
    console.error(
      "handleReauthorisationRequired: Missing account_id in webhook data",
      data
    );
    return;
  }

  try {
    // Mark the account as requiring reauthorisation
    // Store the reauth_token if provided by Mono in this event, which can be used on the frontend
    const reauthToken = data.reauthorisation_token || data.reauth_token; // Check Mono docs for the exact field name

    const updatedAccount = await prisma.bankAccount.updateMany({
      where: {
        monoId: accountId,
      },
      data: {
        status: "REAUTH_REQUIRED",
        reauthToken: reauthToken || null, // Store the token if available
        monoDataStatus: data.meta?.data_status || "PENDING_REAUTHORIZATION",
      },
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Account ${accountId} marked for reauthorisation. Reauth token: ${reauthToken}`
      );
    } else {
      console.warn(
        `handleReauthorisationRequired: No account found with monoId ${accountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to mark account ${accountId} for reauthorisation:`,
      error
    );
  }
}

/**
 * Handle new transactions event
 * This assumes 'data' contains an array of transactions or information to fetch them.
 */
async function handleNewTransactions(webhookData: any) {
  const accountId = webhookData.account?._id || webhookData.account_id;
  if (!accountId) {
    console.error(
      "handleNewTransactions: Missing account_id in webhook data",
      webhookData
    );
    return;
  }

  // If transactions are directly in the webhook payload:
  const transactions =
    webhookData.data?.transactions ||
    webhookData.transactions ||
    (Array.isArray(webhookData.data) ? webhookData.data : null);

  if (transactions && Array.isArray(transactions)) {
    console.log(
      `Processing ${transactions.length} new transactions for account ${accountId} from webhook.`
    );
    for (const txn of transactions) {
      try {
        // Adapt this to your Prisma schema for transactions
        // Ensure you have a unique constraint on transaction ID from Mono to avoid duplicates
        await prisma.transaction.upsert({
          where: { monoTransactionId: txn._id }, // Assuming txn._id is the unique ID from Mono
          update: {
            amount: txn.amount,
            date: new Date(txn.date),
            narration: txn.narration,
            type: txn.type, // "debit" or "credit"
            category: txn.category,
            balanceAfter: txn.balance,
            bankAccountId: accountId, // This needs to be your internal bankAccountId, not monoId
            // You might need to fetch your BankAccount record first
          },
          create: {
            monoTransactionId: txn._id,
            amount: txn.amount,
            date: new Date(txn.date),
            narration: txn.narration,
            type: txn.type,
            category: txn.category,
            balanceAfter: txn.balance,
            bankAccount: { connect: { monoId: accountId } }, // Connect to the BankAccount using its monoId
          },
        });
      } catch (error) {
        console.error(
          `Failed to save transaction ${txn._id} for account ${accountId}:`,
          error
        );
      }
    }
    // Update last synced for the account after processing transactions
    await prisma.bankAccount.updateMany({
      where: { monoId: accountId },
      data: { lastSynced: new Date() },
    });
  } else {
    // If transactions are not in the payload, this event might just be a notification.
    // You might need to call monoService.getAccountTransactions(accountId) here.
    console.log(
      `'new_transaction' event received for account ${accountId}. Consider fetching transactions if not in payload.`
    );
    // Example:
    // const fetchedTransactions = await monoService.getAccountTransactions(accountId, { start: "some_recent_date" });
    // Process fetchedTransactions.data
    await prisma.bankAccount.updateMany({
      where: { monoId: accountId },
      data: { lastSynced: new Date(), status: "SYNCED" },
    });
  }
}

/**
 * Handle data sync event
 */
async function handleDataSync(data: any) {
  const accountId = data.account?._id || data.account_id || data._id;
  if (!accountId) {
    console.error("handleDataSync: Missing account_id in webhook data", data);
    return;
  }

  try {
    // This event might signify completion of a background sync.
    // You might want to fetch new data if not already pushed by other events.
    const updateData: any = {
      lastSynced: new Date(),
      status: "SYNCED", // Or "ACTIVE"
      monoDataStatus: data.meta?.data_status || "AVAILABLE",
    };

    if (data.account?.balance !== undefined) {
      updateData.balance = data.account.balance;
    }

    const updatedAccount = await prisma.bankAccount.updateMany({
      where: {
        monoId: accountId,
      },
      data: updateData,
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Data sync completed for account ${accountId}. Balance updated if provided.`
      );
      // Optionally, trigger a specific transaction fetch if this sync implies new transactions
      // await handleNewTransactions({ account_id: accountId }); // If you want to force a fetch
    } else {
      console.warn(
        `handleDataSync: No account found with monoId ${accountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update sync status for account ${accountId}:`,
      error
    );
  }
}

/**
 * Handle account unlinked event
 */
async function handleAccountUnlinked(data: any) {
  const accountId = data.account?._id || data.account_id || data._id;
  if (!accountId) {
    console.error(
      "handleAccountUnlinked: Missing account_id in webhook data",
      data
    );
    return;
  }

  try {
    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: accountId },
      data: {
        status: "UNLINKED", // Or "INACTIVE", "DISCONNECTED"
        monoAccessToken: null, // Clear sensitive tokens
        reauthToken: null,
        lastSynced: new Date(),
        monoDataStatus: "UNLINKED",
      },
    });

    if (updatedAccount.count > 0) {
      console.log(`Account ${accountId} marked as unlinked.`);
    } else {
      console.warn(
        `handleAccountUnlinked: No account found with monoId ${accountId} to mark as unlinked.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update account ${accountId} from 'account_unlinked' webhook:`,
      error
    );
  }
}

// Remember to add a Transaction model to your prisma.schema if you handle new_transaction events
// Example for prisma.schema:
// model Transaction {
//   id                String    @id @default(cuid())
//   monoTransactionId String    @unique // ID from Mono
//   bankAccountId     String
//   bankAccount       BankAccount @relation(fields: [bankAccountId], references: [id])
//   amount            Float
//   date              DateTime
//   narration         String
//   type              String    // "debit" or "credit"
//   category          String?
//   balanceAfter      Float?    // Balance after this transaction
//   createdAt         DateTime  @default(now())
//   updatedAt         DateTime  @updatedAt
// }
// model BankAccount {
//   // ... other fields
//   monoDataStatus    String?   // To store data_status from Mono meta
//   transactions      Transaction[]
// }
