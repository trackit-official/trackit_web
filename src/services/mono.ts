import axios from "axios";

const MONO_API_URL = "https://api.withmono.com";

/**
 * Mono API Service for interacting with Mono API endpoints
 */
class MonoService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.MONO_SECRET_KEY || "";
  }

  /**
   * Get account details by account ID
   */
  async getAccountById(id: string) {
    try {
      const response = await axios.get(`${MONO_API_URL}/accounts/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": this.secretKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching account:", error);
      throw error;
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
      start?: string; // ISO date string
      end?: string; // ISO date string
    }
  ) {
    try {
      const response = await axios.get(
        `${MONO_API_URL}/accounts/${accountId}/transactions`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
          params: options,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  /**
   * Exchange token for account ID
   */
  async exchangeToken(token: string) {
    try {
      const response = await axios.post(
        `${MONO_API_URL}/account/auth`,
        { code: token },
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error exchanging token:", error);
      throw error;
    }
  }

  /**
   * Get account statement in PDF format
   */
  async getAccountStatement(
    accountId: string,
    options: {
      period?: string; // e.g. last3months, last6months
      output?: "json" | "pdf";
      start?: string; // ISO date string
      end?: string; // ISO date string
    }
  ) {
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
      console.error("Error fetching statement:", error);
      throw error;
    }
  }

  /**
   * Get account identity information
   */
  async getAccountIdentity(accountId: string) {
    try {
      const response = await axios.get(
        `${MONO_API_URL}/accounts/${accountId}/identity`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching identity:", error);
      throw error;
    }
  }

  /**
   * Reauthorize an account
   */
  async reauthorizeAccount(id: string) {
    try {
      const response = await axios.post(
        `${MONO_API_URL}/accounts/${id}/reauthorize`,
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
      console.error("Error reauthorizing account:", error);
      throw error;
    }
  }

  /**
   * Poll for reauthorization status
   */
  async pollReauthorizationStatus(reAuthToken: string) {
    try {
      const response = await axios.get(
        `${MONO_API_URL}/accounts/reauthorize/${reAuthToken}`,
        {
          headers: {
            "Content-Type": "application/json",
            "mono-sec-key": this.secretKey,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error polling reauthorization status:", error);
      throw error;
    }
  }

  /**
   * Unlink an account
   */
  async unlinkAccount(id: string) {
    try {
      const response = await axios.post(
        `${MONO_API_URL}/accounts/${id}/unlink`,
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
      console.error("Error unlinking account:", error);
      throw error;
    }
  }

  /**
   * Get account institutions
   */
  async getInstitutions() {
    try {
      const response = await axios.get(`${MONO_API_URL}/coverage`, {
        headers: {
          "Content-Type": "application/json",
          "mono-sec-key": this.secretKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching institutions:", error);
      throw error;
    }
  }
}

export default new MonoService();
