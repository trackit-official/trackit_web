import { NextRequest, NextResponse } from "next/server";
import prisma from "@/libs/prisma"; // Corrected import path
import monoService from "@/services/monoService"; // Corrected import path

/**
 * POST /api/webhooks/mono
 * Handles webhook events from Mono
 */
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("mono-webhook-signature");
    if (!signature) {
      console.warn("Webhook request missing mono-webhook-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const rawBody = await request.text();
    const isValid = monoService.verifyWebhookSignature(signature, rawBody);

    if (!isValid) {
      console.warn("Webhook request with invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event, data, meta } = body;

    console.log(`Received Mono webhook event: ${event}`, { data, meta });

    switch (event) {
      case "mono.events.account_updated":
        await handleAccountUpdated(data, meta);
        break;
      case "mono.events.account_reauthorized":
        await handleAccountReauthorized(data, meta);
        break;
      case "mono.events.reauthorisation_required": // Mono's spelling
      case "mono.events.reauthorization_required": // Common spelling
        await handleReauthorisationRequired(data, meta);
        break;
      case "mono.events.new_transaction":
      case "mono.events.transactions_updated":
        await handleNewTransactions(data, meta);
        break;
      // It's good practice to handle data_sync completion if it implies new data is ready
      case "mono.events.data_sync_completed":
      case "mono.events.data_sync": // if this is the event name from Mono
        await handleDataSync(data, meta);
        break;
      case "mono.events.account_unlinked":
        await handleAccountUnlinked(data);
        break;
      default:
        console.log(`Unhandled Mono webhook event: ${event}`, { data, meta });
    }

    return NextResponse.json({ received: true, event });
  } catch (error: any) {
    console.error(
      "Webhook processing error:",
      error.message,
      error.stack,
      // Avoid trying to read body again if request object is not as expected
      error.request
        ? await error.request.text().catch(() => "")
        : "No request body available"
    );
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}

async function handleAccountUpdated(data: any, meta: any) {
  const monoAccountId = data.account?._id || data._id; // data._id can be fallback if data.account is not present
  if (!monoAccountId) {
    console.error(
      "handleAccountUpdated: Missing account_id (monoAccountId) in webhook data",
      { data, meta }
    );
    return;
  }

  try {
    const updatePayload: any = {
      lastSynced: new Date(),
      monoDataStatus: meta?.data_status, // Capture data_status from meta
    };

    if (data.account?.balance !== undefined) {
      updatePayload.balance = data.account.balance / 100; // Assuming balance is in kobo/cents
    }
    if (data.account?.status) {
      updatePayload.status = mapMonoAccountStatus(data.account.status);
    }

    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: monoAccountId },
      data: updatePayload,
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Account ${monoAccountId} updated successfully via 'account_updated' webhook.`
      );
    } else {
      console.warn(
        `handleAccountUpdated: No account found with monoId ${monoAccountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update account ${monoAccountId} from 'account_updated' webhook:`,
      {
        message: error instanceof Error ? error.message : String(error),
        data,
        meta,
      }
    );
  }
}

async function handleAccountReauthorized(data: any, meta: any) {
  const monoAccountId = data.account?._id || data._id;
  if (!monoAccountId) {
    console.error(
      "handleAccountReauthorized: Missing account_id in webhook data",
      { data, meta }
    );
    return;
  }

  try {
    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: monoAccountId },
      data: {
        status: "ACTIVE",
        reauthToken: null, // Clear any stored reauth token
        lastSynced: new Date(),
        monoDataStatus: meta?.data_status || "AVAILABLE",
      },
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Account ${monoAccountId} marked as reauthorized and active via webhook.`
      );
      // Optionally, trigger a data sync for fresh data
      // await monoService.triggerDataSync(monoAccountId);
    } else {
      console.warn(
        `handleAccountReauthorized: No account found with monoId ${monoAccountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update account ${monoAccountId} from 'account_reauthorized' webhook:`,
      {
        message: error instanceof Error ? error.message : String(error),
        data,
        meta,
      }
    );
  }
}

async function handleReauthorisationRequired(data: any, meta: any) {
  const monoAccountId = data.account?._id || data._id;
  if (!monoAccountId) {
    console.error(
      "handleReauthorisationRequired: Missing account_id in webhook data",
      { data, meta }
    );
    return;
  }

  try {
    const reauthToken = data.reauthorisation_token || data.reauth_token; // Check Mono docs for the exact field name

    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: monoAccountId },
      data: {
        status: "REAUTH_REQUIRED",
        reauthToken: reauthToken || null, // Store the reauth_token
        monoDataStatus: meta?.data_status || "PENDING_REAUTHORIZATION",
        lastSynced: new Date(), // Update last synced time
      },
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Account ${monoAccountId} marked for reauthorisation. Reauth token: ${reauthToken ? "stored" : "not provided"}.`
      );
    } else {
      console.warn(
        `handleReauthorisationRequired: No account found with monoId ${monoAccountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to mark account ${monoAccountId} for reauthorisation via webhook:`,
      {
        message: error instanceof Error ? error.message : String(error),
        data,
        meta,
      }
    );
  }
}

async function handleNewTransactions(webhookData: any, meta: any) {
  const monoAccountId = webhookData.account?._id || webhookData.account_id; // account_id might be direct
  if (!monoAccountId) {
    console.error(
      "handleNewTransactions: Missing monoAccountId in webhook data",
      { webhookData, meta }
    );
    return;
  }

  // Attempt to find the internal bank account ID
  const bankAccount = await prisma.bankAccount.findUnique({
    where: { monoId: monoAccountId },
    select: { id: true, userId: true }, // Select userId as well
  });

  if (!bankAccount) {
    console.warn(
      `handleNewTransactions: BankAccount with monoId ${monoAccountId} not found in DB.`
    );
    return;
  }
  const internalAccountId = bankAccount.id;
  const userId = bankAccount.userId; // Get the userId from the bankAccount

  // Check if transactions are directly in the webhook payload
  const transactions =
    webhookData.data?.transactions ||
    webhookData.transactions ||
    (Array.isArray(webhookData.data) ? webhookData.data : null);

  if (transactions && Array.isArray(transactions) && transactions.length > 0) {
    console.log(
      `Processing ${transactions.length} new transactions for monoAccount ${monoAccountId} (internal: ${internalAccountId}) from webhook.`
    );
    for (const txn of transactions) {
      if (!txn._id) {
        console.warn("Skipping transaction without _id:", txn);
        continue;
      }
      try {
        await prisma.transaction.upsert({
          where: { monoTransactionId: txn._id },
          update: {
            amount: txn.amount / 100, // Assuming kobo/cents
            date: new Date(txn.date),
            narration: txn.narration,
            type: mapMonoTransactionType(txn.type), // "debit" or "credit" -> EXPENSE/INCOME
            category: txn.category, // Mono's category
            balanceAfter: txn.balance / 100, // Assuming kobo/cents
            currency: txn.currency || "NGN", // Default if not provided
            // userId and accountId are already set on create and should not change on update for this record
          },
          create: {
            monoTransactionId: txn._id,
            userId: userId, // Set the userId
            accountId: internalAccountId,
            amount: txn.amount / 100, // Assuming kobo/cents
            date: new Date(txn.date),
            narration: txn.narration,
            type: mapMonoTransactionType(txn.type),
            category: txn.category,
            balanceAfter: txn.balance / 100, // Assuming kobo/cents
            currency: txn.currency || "NGN",
            // bankAccount: { connect: { id: internalAccountId } }, // Already handled by accountId
          },
        });
      } catch (error) {
        console.error(
          `Failed to save transaction ${txn._id} for monoAccount ${monoAccountId}:`,
          {
            message: error instanceof Error ? error.message : String(error),
            transactionData: txn,
          }
        );
      }
    }
    // Update last synced for the account after processing transactions
    await prisma.bankAccount.update({
      where: { id: internalAccountId },
      data: {
        lastSynced: new Date(),
        monoDataStatus: meta?.data_status || "AVAILABLE",
      },
    });
  } else {
    console.log(
      `'new_transaction' or 'transactions_updated' event for monoAccount ${monoAccountId}. No transactions in payload or empty. Triggering manual fetch.`
    );
    try {
      // Fetch recent transactions using monoService
      const fetchedTxData = await monoService.getAccountTransactions(
        monoAccountId,
        { limit: 50 }
      ); // Fetch last 50 for example
      if (
        fetchedTxData &&
        fetchedTxData.data &&
        fetchedTxData.data.length > 0
      ) {
        console.log(
          `Fetched ${fetchedTxData.data.length} transactions for monoAccount ${monoAccountId}`
        );
        for (const txn of fetchedTxData.data) {
          if (!txn._id) {
            console.warn("Skipping fetched transaction without _id:", txn);
            continue;
          }
          await prisma.transaction.upsert({
            where: { monoTransactionId: txn._id },
            update: {
              amount: txn.amount / 100,
              date: new Date(txn.date),
              narration: txn.narration,
              type: mapMonoTransactionType(txn.type),
              category: txn.category,
              balanceAfter: txn.balance / 100,
              currency: txn.currency || "NGN",
            },
            create: {
              monoTransactionId: txn._id,
              userId: userId, // Set the userId
              accountId: internalAccountId,
              amount: txn.amount / 100,
              date: new Date(txn.date),
              narration: txn.narration,
              type: mapMonoTransactionType(txn.type),
              category: txn.category,
              balanceAfter: txn.balance / 100,
              currency: txn.currency || "NGN",
            },
          });
        }
      }
      await prisma.bankAccount.update({
        where: { id: internalAccountId },
        data: {
          lastSynced: new Date(),
          status: "ACTIVE", // Or SYNCED
          monoDataStatus:
            meta?.data_status || fetchedTxData.data?.length > 0
              ? "AVAILABLE"
              : "PROCESSING",
        },
      });
    } catch (error) {
      console.error(
        `Error fetching transactions for ${monoAccountId} after webhook notification:`,
        error
      );
      await prisma.bankAccount.update({
        where: { id: internalAccountId },
        data: {
          lastSynced: new Date(),
          status: "SYNC_FAILED",
          monoDataStatus: "FAILED",
        },
      });
    }
  }
}

async function handleDataSync(data: any, meta: any) {
  const monoAccountId = data.account?._id || data._id;
  if (!monoAccountId) {
    console.error("handleDataSync: Missing account_id in webhook data", {
      data,
      meta,
    });
    return;
  }

  try {
    const updatePayload: any = {
      lastSynced: new Date(),
      status: mapMonoAccountStatus(data.account?.status || "active"), // Default to active if not present
      monoDataStatus: meta?.data_status || "AVAILABLE",
    };

    if (data.account?.balance !== undefined) {
      updatePayload.balance = data.account.balance / 100; // Assuming kobo/cents
    }

    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: monoAccountId },
      data: updatePayload,
    });

    if (updatedAccount.count > 0) {
      console.log(
        `Data sync status updated for account ${monoAccountId} via webhook. Balance updated if provided.`
      );
      // If this event implies new transactions might be available, consider fetching them
      // await handleNewTransactions({ account: { _id: monoAccountId } }, meta); // Pass necessary structure
    } else {
      console.warn(
        `handleDataSync: No account found with monoId ${monoAccountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to update sync status for account ${monoAccountId} from 'data_sync' webhook:`,
      {
        message: error instanceof Error ? error.message : String(error),
        data,
        meta,
      }
    );
  }
}

async function handleAccountUnlinked(data: any) {
  const monoAccountId = data.account?._id || data._id;
  if (!monoAccountId) {
    console.error(
      "handleAccountUnlinked: Missing account_id in webhook data",
      data
    );
    return;
  }

  try {
    const updatedAccount = await prisma.bankAccount.updateMany({
      where: { monoId: monoAccountId },
      data: {
        status: "UNLINKED",
        reauthToken: null, // Clear reauth token on unlink
        isActive: false, // Mark as inactive in your system
        lastSynced: new Date(),
        monoDataStatus: "UNLINKED", // Or a similar status you define
        monoId: null, // Important: Nullify monoId to allow relinking if needed, or handle differently
      },
    });

    if (updatedAccount.count > 0) {
      console.log(`Account ${monoAccountId} marked as unlinked via webhook.`);
    } else {
      console.warn(
        `handleAccountUnlinked: No account found with monoId ${monoAccountId} to update.`
      );
    }
  } catch (error) {
    console.error(
      `Failed to mark account ${monoAccountId} as unlinked via webhook:`,
      {
        message: error instanceof Error ? error.message : String(error),
        data,
      }
    );
  }
}

// Helper function to map Mono transaction types to your enum
function mapMonoTransactionType(monoType: string): "INCOME" | "EXPENSE" {
  // Based on your Prisma schema, you only have INCOME and EXPENSE (and TRANSFER)
  // Mono typically uses 'credit' and 'debit'
  if (monoType?.toLowerCase() === "credit") {
    return "INCOME";
  }
  return "EXPENSE"; // Default to EXPENSE for 'debit' or other types
}

// Helper function to map Mono account status to your BankAccount status
function mapMonoAccountStatus(monoStatus: string): string {
  // Example mapping, adjust based on your needs and Mono's possible statuses
  const status = monoStatus?.toLowerCase();
  if (status === "active" || status === "available") {
    return "ACTIVE";
  }
  if (
    status === "reauthorisation_required" ||
    status === "reauthorization_required"
  ) {
    return "REAUTH_REQUIRED";
  }
  if (status === "disabled" || status === "suspended") {
    return "INACTIVE"; // Or a specific status like "SUSPENDED"
  }
  return "NEEDS_ATTENTION"; // Default for unknown or other statuses
}

// Ensure NextRequest and NextResponse are imported from "next/server"
