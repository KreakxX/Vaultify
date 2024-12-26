import { Expense } from "./Expense";

export interface Category{

  categoryId : number
  name : string
  color: string
  expenses: Expense[];
}