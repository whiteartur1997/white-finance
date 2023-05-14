import {CurrencyType} from "./wallet";

export interface Transaction {
  id?: string | number;
  categoryId: string;
  walletId: string;
  userId: string;
  amount: number;
  currency: CurrencyType;
  date: string;
}
