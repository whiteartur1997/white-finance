export interface Wallet {
  userId: string;
  name: string;
  currency: "UAH" | "USD" | "EUR";
  amount: number;
}
