import { Category } from "./Category"

export interface Expense{
  expenseId : number
  name: string
  category: Category
  ausgabe: number
  ausgabeDatum: Date
}