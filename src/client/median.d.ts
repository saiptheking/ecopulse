export {};

declare global {
  interface Window {
    median?: {
      onesignal?: {
        login(externalId: string): unknown;
      };
    };
  }
}