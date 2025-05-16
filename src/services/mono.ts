import axios, { AxiosError } from "axios";
import crypto from "crypto";

const MONO_API_URL = "https://api.withmono.com";

// Interfaces from libs/mono.ts
export interface MonoAccount {
  id: string;
  institution: {
    name: string;
    bankCode: string;
    type: string;
  };
  name: string;
  accountNumber: string;
  type: string;
  balance: number; // Consider that balance can be in kobo/cents
  currency: string;
  bvn: string;
  // Add any other relevant fields based on Mono's API documentation
  meta?: {
    data_status: string; // e.g., "AVAILABLE", "PROCESSING", "FAILED"
    auth_method: string; // e.g., "internet_banking", "mobile_banking"
  };
  reauthorisation_required?: boolean;
  reauthorisation_token?: string; // This might be what reauthorizeAccount returns
}

export interface MonoTransaction {
  _id: string;
  amount: number;
  date: string;
  narration: string;
  type: "debit" | "credit";
  category?: string;
  balance: number;
}

export interface MonoIdentity {
  fullName: string;
  email: string;
  phone: string;
  bvn: string;
  address?: string;
  // Add any other relevant fields
  gender?: string;
  dob?: string;
  nationality?: string;
}

/**
 * Mono API Service for interacting with Mono API endpoints
 */
class MonoService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.MONO_SECRET_KEY || "";
    if (!this.secretKey) {
      console.error(
        "MONO_SECRET_KEY is not set in environment variables. MonoService may not function correctly."
      );
    }
  }

  /**
   * Verifies the signature of a webhook request from Mono.
   * @param signature The value of the 'mono-webhook-signature' header.
   * @param body The raw request body (as a string).
   * @returns True if the signature is valid, false otherwise.
   */
  verifyWebhookSignature(signature: string, body: string): boolean {
    if (!this.secretKey) {
      console.error(
        "MONO_SECRET_KEY is not set. Cannot verify webhook signature."
      );
      return false;
    }
    const hash = crypto
      .createHmac("sha512", this.secretKey)
      .update(body)
      .digest("hex");
    return hash === signature;
  }

  /**
   * Exchange token for account ID
   */
  async exchangeToken(code: string): Promise<{ id: string }> {
    try {
      const response = await axios.post<{ id: string }>(
        `${MONO_API_URL}/account/auth`,
        { code },
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error exchanging token:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data || new Error("Error exchanging token with Mono")
        );
      }
      console.error("Error exchanging token (unknown):", error);
      throw new Error(
        "An unknown error occurred while exchanging token with Mono"
      );
    }
  }

  /**
   * Get account details by account ID
   */
  async getAccountDetails(
    accountId: string
  ): Promise<{ account: MonoAccount; meta?: any }> {
    try {
      const response = await axios.get<{ account: MonoAccount; meta?: any }>(
        `${MONO_API_URL}/accounts/${accountId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching account details:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error fetching account details from Mono")
        );
      }
      console.error("Error fetching account details (unknown):", error);
      throw new Error(
        "An unknown error occurred while fetching account details from Mono"
      );
    }
  }

  /**
   * Get account identity information
   */
  async getAccountIdentity(accountId: string): Promise<MonoIdentity> {
    try {
      // The Mono API for identity might return the identity object directly or nested under a 'data' property.
      // Adjust based on actual API response structure. Assuming it's nested under 'data' for now.
      const response = await axios.get<{ data: MonoIdentity } | MonoIdentity>(
        `${MONO_API_URL}/accounts/${accountId}/identity`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      // Check if response.data has a 'data' property
      if ("data" in response.data && typeof response.data.data === "object") {
        return response.data.data as MonoIdentity;
      }
      return response.data as MonoIdentity;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching account identity:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error fetching account identity from Mono")
        );
      }
      console.error("Error fetching account identity (unknown):", error);
      throw new Error(
        "An unknown error occurred while fetching account identity from Mono"
      );
    }
  }

  /**
   * Get account transactions
   */
  async getAccountTransactions(
    accountId: string,
    options?: {
      paginate?: boolean;
      limit?: number;
      page?: number;
      start?: string; // ISO date string e.g. 01-01-2020
      end?: string; // ISO date string
      narration?: string;
      type?: "debit" | "credit";
    }
  ): Promise<{ paging: any; data: MonoTransaction[] }> {
    // Adjusted to match typical Mono response
    try {
      const response = await axios.get<{
        paging: any;
        data: MonoTransaction[];
      }>(`${MONO_API_URL}/accounts/${accountId}/transactions`, {
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": this.secretKey,
        },
        params: options,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching transactions:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error fetching transactions from Mono")
        );
      }
      console.error("Error fetching transactions (unknown):", error);
      throw new Error(
        "An unknown error occurred while fetching transactions from Mono"
      );
    }
  }

  /**
   * Get account statement in PDF format or JSON
   */
  async getAccountStatement(
    accountId: string,
    options: {
      period: string; // e.g. last3months, last6months, or specific range like 01-01-2020_31-01-2020
      output?: "json" | "pdf";
    }
  ): Promise<any> {
    // Can be JSON data or ArrayBuffer for PDF
    try {
      const response = await axios.get(
        `${MONO_API_URL}/accounts/${accountId}/statement`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
          params: options,
          responseType: options.output === "pdf" ? "arraybuffer" : "json",
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching statement:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error fetching statement from Mono")
        );
      }
      console.error("Error fetching statement (unknown):", error);
      throw new Error(
        "An unknown error occurred while fetching statement from Mono"
      );
    }
  }

  /**
   * Reauthorize an account. This typically returns a reauthorization token.
   * The Mono documentation should clarify the exact request body and response.
   * This might initiate the reauth flow, and the user would complete it on the Mono widget.
   */
  async reauthorizeAccount(
    accountId: string
  ): Promise<{ token: string; [key: string]: any }> {
    try {
      const response = await axios.post<{ token: string; [key: string]: any }>(
        // Note: The endpoint might be /reauthorise or /reauthorize. Using /reauthorize based on common spelling.
        // Also, some reauth flows might require a POST to /accounts/{ACCOUNT_ID}/reauthorise
        // and then the user uses the reauth_token with Mono Connect.
        // For now, assuming this endpoint initiates and returns a token for the widget.
        `${MONO_API_URL}/accounts/${accountId}/reauthorize`,
        {}, // Body might be required depending on Mono's specific API for this
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error reauthorizing account:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error reauthorizing account with Mono")
        );
      }
      console.error("Error reauthorizing account (unknown):", error);
      throw new Error(
        "An unknown error occurred while reauthorizing account with Mono"
      );
    }
  }

  /**
   * Poll for reauthorization status using a reauth_token obtained from the reauthorization process.
   * This is useful if the reauthorization is an asynchronous process.
   */
  async pollReauthorizationStatus(
    reauthToken: string
  ): Promise<{ status: string; code?: string; [key: string]: any }> {
    try {
      // The endpoint for polling might be different, e.g., /account/reauthorise/status or similar.
      // Using a plausible endpoint based on the original service file.
      // Mono's official documentation is the source of truth here.
      const response = await axios.get<{
        status: string;
        code?: string;
        [key: string]: any;
      }>(
        `${MONO_API_URL}/accounts/reauthorise/${reauthToken}`, // This endpoint might need verification from Mono docs
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey, // Secret key might not be needed for polling status, or it might be a public endpoint
          },
        }
      );
      // If successful reauth, the response might include a new 'code' (similar to initial auth)
      // which then needs to be exchanged for a new account_id or to confirm re-link.
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error polling reauthorization status:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error polling reauthorization status from Mono")
        );
      }
      console.error("Error polling reauthorization status (unknown):", error);
      throw new Error(
        "An unknown error occurred while polling reauthorization status from Mono"
      );
    }
  }

  /**
   * Unlink an account
   */
  async unlinkAccount(
    accountId: string
  ): Promise<{ message?: string; [key: string]: any }> {
    try {
      const response = await axios.post<{
        message?: string;
        [key: string]: any;
      }>(
        `${MONO_API_URL}/accounts/${accountId}/unlink`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error unlinking account:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data || new Error("Error unlinking account with Mono")
        );
      }
      console.error("Error unlinking account (unknown):", error);
      throw new Error(
        "An unknown error occurred while unlinking account with Mono"
      );
    }
  }

  /**
   * Get available financial institutions
   */
  async getInstitutions(): Promise<any[]> {
    // Replace 'any' with a proper Institution interface if available
    try {
      const response = await axios.get<any[]>(`${MONO_API_URL}/institutions`, {
        // Endpoint changed to /institutions from /coverage
        headers: {
          // "Content-Type": "application/json", // Not always needed for GET
          // "mono-sec-key": this.secretKey, // Public key might be used here, or no key for public data
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error fetching institutions:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data ||
          new Error("Error fetching institutions from Mono")
        );
      }
      console.error("Error fetching institutions (unknown):", error);
      throw new Error(
        "An unknown error occurred while fetching institutions from Mono"
      );
    }
  }

  /**
   * Sync an account (Trigger manual account refresh)
   * @param accountId Mono Account ID
   */
  async syncAccount(
    accountId: string
  ): Promise<{ status: string; message?: string; code?: string }> {
    try {
      const response = await axios.post<{
        status: string;
        message?: string;
        code?: string;
      }>(
        `${MONO_API_URL}/accounts/${accountId}/sync`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      // The response for sync might indicate if it's queued, successful, or if reauth is needed.
      // A 'code' might be returned if reauth is required immediately.
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error syncing account:",
          error.response?.data || error.message
        );
        throw (
          error.response?.data || new Error("Error syncing account with Mono")
        );
      }
      console.error("Error syncing account (unknown):", error);
      throw new Error(
        "An unknown error occurred while syncing account with Mono"
      );
    }
  }
}

export default new MonoService();
