export interface Wallet {
  id?: string | number;
  userId: string;
  name: string;
  currency: "UAH" | "USD" | "EUR";
  amount: number;
}
