import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expenses } from '../models/expenses';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(expenses: Expenses){
    return this.httpClient.post(`${this.uri}/expenses`,expenses);
  }
  public updateData(expenses: Expenses){
    return this.httpClient.put(`${this.uri}/expenses`,expenses);
  }
  public deleteData(id: number,category: string){
    return this.httpClient.delete(`${this.uri}/expenses/${id}/${category}`);
  }
   public getData(category:string){
    return this.httpClient.get<Expenses[]>(`${this.uri}/expenses/${category}`);
  }
}
