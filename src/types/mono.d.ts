declare module "@mono.co/connect.js" {
  interface MonoConnectOptions {
    key: string;
    onSuccess: (data: { code: string }) => void;
    onClose?: () => void;
    onLoad?: () => void;
    reauth_token?: string;
    // Add any other options based on Mono documentation
    [key: string]: any; // Allow other properties
  }

  class MonoConnect {
    constructor(options: MonoConnectOptions);
    setup: (options?: MonoConnectOptions) => void;
    open: () => void;
    // Add any other methods based on Mono documentation
  }

  export default MonoConnect;
}
