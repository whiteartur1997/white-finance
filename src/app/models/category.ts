export interface Category {
  id?: string | number;
  imageUrl: string;
  name: string;
  type: "income" | "expense"
}
