\
import { monoSecretKey } from "@/config/monoConfig";
import { Mono } from "mono-node";
import crypto from "crypto";

const monoClient = new Mono({
  secretKey: monoSecretKey!,
});

/**
 * Verifies the webhook signature from Mono.
 * @param signature The signature from the 'mono-webhook-signature' header.
 * @param rawBody The raw request body string.
 * @returns True if the signature is valid, false otherwise.
 */
function verifyWebhookSignature(signature: string, rawBody: string): boolean {
  const secret = monoSecretKey!;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
}

/**
 * Exchanges an authorization code for an account ID.
 * @param code The authorization code from Mono Connect.
 * @returns The account ID.
 */
async function getAccountId(code: string): Promise<string> {
  try {
    const { id } = await monoClient.auth.getAccountId({ code });
    return id;
  } catch (error) {
    console.error("Error exchanging code for account ID:", error);
    throw new Error("Failed to get account ID from Mono.");
  }
}

/**
 * Fetches account information from Mono.
 * @param accountId The Mono account ID.
 * @returns Account information.
 */
async function getAccountInformation(accountId: string): Promise<any> {
  try {
    const accountInfo = await monoClient.account.getAccountInformation({
      accountId,
    });
    return accountInfo;
  } catch (error) {
    console.error("Error fetching account information:", error);
    throw new Error("Failed to fetch account information from Mono.");
  }
}

/**
 * Fetches account balance from Mono.
 * @param accountId The Mono account ID.
 * @returns Account balance information.
 */
async function getAccountBalance(accountId: string): Promise<any> {
  try {
    // In mono-node v2, getAccountInformation includes balance.
    // If a separate balance endpoint is needed or preferred, adjust accordingly.
    // For now, assuming getAccountInformation provides what's needed.
    const balanceInfo = await monoClient.account.getAccountInformation({ // Or specific balance endpoint if available
      accountId,
    });
    return balanceInfo; // Or specific balance data from the response
  } catch (error) {
    console.error("Error fetching account balance:", error);
    throw new Error("Failed to fetch account balance from Mono.");
  }
}

/**
 * Fetches transactions for an account from Mono.
 * @param accountId The Mono account ID.
 * @param options Optional parameters for fetching transactions (e.g., start, end, narration, type, paginate).
 * @returns Transaction data.
 */
async function getAccountTransactions(
  accountId: string,
  options?: {
    start?: string;
    end?: string;
    narration?: string;
    type?: string;
    paginate?: boolean;
    limit?: number;
    page?: number;
  }
): Promise<any> {
  try {
    const transactions = await monoClient.account.getAccountTransactions({
      accountId,
      ...options,
    });
    return transactions;
  } catch (error) {
    console.error("Error fetching account transactions:", error);
    throw new Error("Failed to fetch account transactions from Mono.");
  }
}

/**
 * Unlinks an account from Mono.
 * @param accountId The Mono account ID.
 * @returns Confirmation of unlinking.
 */
async function unlinkAccount(accountId: string): Promise<any> {
  try {
    const result = await monoClient.account.unlinkAccount({ accountId });
    return result;
  } catch (error) {
    console.error("Error unlinking account:", error);
    throw new Error("Failed to unlink account with Mono.");
  }
}

/**
 * Fetches identity information for an account from Mono.
 * @param accountId The Mono account ID.
 * @returns Identity information.
 */
async function getIdentity(accountId: string): Promise<any> {
  try {
    const identityInfo = await monoClient.account.getIdentity({ accountId });
    return identityInfo;
  } catch (error) {
    console.error("Error fetching identity information:", error);
    throw new Error("Failed to fetch identity information from Mono.");
  }
}

/**
 * Fetches income information for an account from Mono.
 * @param accountId The Mono account ID.
 * @returns Income information.
 */
async function getIncome(accountId: string): Promise<any> {
  try {
    const incomeInfo = await monoClient.account.getIncome({ accountId });
    return incomeInfo;
  } catch (error) {
    console.error("Error fetching income information:", error);
    throw new Error("Failed to fetch income information from Mono.");
  }
}

/**
 * Manually triggers a data sync for an account.
 * @param accountId The Mono account ID.
 * @returns Sync status.
 */
async function triggerDataSync(accountId: string): Promise<any> {
  try {
    const syncStatus = await monoClient.dataSync.triggerDataSync({ accountId });
    return syncStatus;
  } catch (error) {
    console.error("Error triggering data sync:", error);
    throw new Error("Failed to trigger data sync with Mono.");
  }
}

const monoService = {
  verifyWebhookSignature,
  getAccountId,
  getAccountInformation,
  getAccountBalance, // Consider if this is needed or if getAccountInformation suffices
  getAccountTransactions,
  unlinkAccount,
  getIdentity,
  getIncome,
  triggerDataSync,
  // Add other Mono functionalities as needed
};

export default monoService;
