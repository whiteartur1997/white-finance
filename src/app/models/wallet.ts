export type CurrencyType = "UAH" | "USD" | "EUR";

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  currency: CurrencyType;
  amount: number;
}
