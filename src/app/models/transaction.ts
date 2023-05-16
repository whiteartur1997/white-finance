import {CurrencyType} from "./wallet";

export interface Transaction {
  id: string;
  categoryId: string;
  walletId: string;
  userId: string;
  amount: number;
  currency: CurrencyType;
  date: string;
}
