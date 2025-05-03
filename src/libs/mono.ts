/**
 * Mono API Service
 * Handles all interactions with the Mono API
 */

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
  balance: number;
  currency: string;
  bvn: string;
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
}

class MonoService {
  private secretKey: string;
  private baseUrl = "https://api.withmono.com";

  constructor() {
    this.secretKey = process.env.MONO_SECRET_KEY as string;
    if (!this.secretKey) {
      console.error("Mono secret key not found");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = {
      "Content-Type": "application/json",
      "mono-sec-key": this.secretKey,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error making request to Mono API");
    }

    return response.json() as Promise<T>;
  }

  /**
   * Exchange a code for an account ID
   * @param code Code from Mono Connect widget
   */
  async exchangeToken(code: string): Promise<{ id: string }> {
    return this.request<{ id: string }>("/account/auth", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  }

  /**
   * Get account information
   * @param accountId Mono Account ID
   */
  async getAccountDetails(
    accountId: string
  ): Promise<{ account: MonoAccount }> {
    return this.request<{ account: MonoAccount }>(`/accounts/${accountId}`);
  }

  /**
   * Get account identity information
   * @param accountId Mono Account ID
   */
  async getAccountIdentity(accountId: string): Promise<{ data: MonoIdentity }> {
    return this.request<{ data: MonoIdentity }>(
      `/accounts/${accountId}/identity`
    );
  }

  /**
   * Get account transactions
   * @param accountId Mono Account ID
   * @param params Optional query parameters
   */
  async getTransactions(
    accountId: string,
    params: {
      start?: string; // ISO date string
      end?: string; // ISO date string
      paginate?: boolean;
      limit?: number;
      page?: number;
    } = {}
  ): Promise<{
    data: MonoTransaction[];
    total: number;
    page: number;
    size: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.start) queryParams.append("start", params.start);
    if (params.end) queryParams.append("end", params.end);
    if (params.paginate !== undefined)
      queryParams.append("paginate", params.paginate.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.page) queryParams.append("page", params.page.toString());

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    return this.request<{
      data: MonoTransaction[];
      total: number;
      page: number;
      size: number;
    }>(`/accounts/${accountId}/transactions${queryString}`);
  }

  /**
   * Reauthorize an account
   * @param accountId Mono Account ID
   */
  async reauthorizeAccount(accountId: string): Promise<{ token: string }> {
    return this.request<{ token: string }>(
      `/accounts/${accountId}/reauthorise`,
      {
        method: "POST",
      }
    );
  }

  /**
   * Unlink an account
   * @param accountId Mono Account ID
   */
  async unlinkAccount(accountId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/accounts/${accountId}/unlink`, {
      method: "POST",
    });
  }

  /**
   * Sync an account (Trigger manual account refresh)
   * @param accountId Mono Account ID
   */
  async syncAccount(accountId: string): Promise<{ status: string }> {
    return this.request<{ status: string }>(`/accounts/${accountId}/sync`, {
      method: "POST",
    });
  }
}

// Create singleton instance
const monoService = new MonoService();
export default monoService;
