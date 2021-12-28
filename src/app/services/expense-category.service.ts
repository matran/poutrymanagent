import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExpenseCategory } from '../models/expense-category';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(expensecategory: ExpenseCategory){
    return this.httpClient.post(`${this.uri}/expensecategory`,expensecategory);
  }
  public updateData(expensecategory: ExpenseCategory){
    return this.httpClient.put(`${this.uri}/expensecategory`,expensecategory);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/expensecategory/${id}`);
  }
   public getData(){
    return this.httpClient.get<ExpenseCategory[]>(`${this.uri}/expensecategory`);
  }
}
