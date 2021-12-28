import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AllExpenses } from '../models/all-expenses';

@Injectable({
  providedIn: 'root'
})
export class AllExpensesService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public getData(){
    return this.httpClient.get<AllExpenses[]>(`${this.uri}/allexpenses`);
  }
  public filterByDate(daterange :string){
    return this.httpClient.post<AllExpenses[]>(`${this.uri}/allexpenses`,daterange);
  }
  public filterByBatch(batch:string){
    return this.httpClient.get<AllExpenses[]>(`${this.uri}/batchfilter/${batch}`);
  }
  public filterByDateBatch(batch: string,daterange: string){
    return this.httpClient.post<AllExpenses[]>(`${this.uri}/batchdatefilter/${batch}`,daterange);
  }
}
