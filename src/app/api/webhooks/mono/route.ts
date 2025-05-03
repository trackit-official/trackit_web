import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/libs/prisma";

/**
 * POST /api/webhooks/mono
 * Handles webhook events from Mono
 */
export async function POST(request: NextRequest) {
  try {
    // Get the webhook signature
    const signature = request.headers.get("mono-webhook-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Get the raw body for verification
    const body = await request.json();
    const rawBody = JSON.stringify(body);

    // Verify the webhook signature
    const secret = process.env.MONO_WEBHOOK_SECRET as string;
    const expectedSignature = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const { event, data } = body;

    // Handle different webhook events
    switch (event) {
      case "mono.events.account_updated":
        await handleAccountUpdated(data);
        break;
      case "mono.events.reauthorisation_required":
        await handleReauthorisationRequired(data);
        break;
      case "mono.events.data_sync":
        await handleDataSync(data);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`, data);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle account updated event
 */
async function handleAccountUpdated(data: any) {
  const { account_id } = data;

  try {
    // Update the account status
    await prisma.bankAccount.update({
      where: {
        monoId: account_id,
      },
      data: {
        lastSynced: new Date(),
      },
    });

    console.log(`Account ${account_id} updated successfully`);
  } catch (error) {
    console.error(`Failed to update account ${account_id}:`, error);
  }
}

/**
 * Handle reauthorisation required event
 */
async function handleReauthorisationRequired(data: any) {
  const { account_id } = data;

  try {
    // Mark the account as requiring reauthorisation
    await prisma.bankAccount.update({
      where: {
        monoId: account_id,
      },
      data: {
        status: "REAUTH_REQUIRED",
      },
    });

    console.log(`Account ${account_id} marked for reauthorisation`);
  } catch (error) {
    console.error(
      `Failed to mark account ${account_id} for reauthorisation:`,
      error
    );
  }
}

/**
 * Handle data sync event
 */
async function handleDataSync(data: any) {
  const { account_id } = data;

  try {
    // Update the lastSynced timestamp
    await prisma.bankAccount.update({
      where: {
        monoId: account_id,
      },
      data: {
        lastSynced: new Date(),
        status: "SYNCED",
      },
    });

    console.log(`Data sync completed for account ${account_id}`);
  } catch (error) {
    console.error(
      `Failed to update sync status for account ${account_id}:`,
      error
    );
  }
}
