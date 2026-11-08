export {};

declare global {
  interface Window {
    median?: {
      onesignal?: {
        login(externalId: string): unknown;
        User: {
          addEmail(email: string): unknown;
        };
      };
    };
  }
}