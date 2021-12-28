import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sales } from '../models/sales';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(sales: Sales){
    return this.httpClient.post(`${this.uri}/sales`,sales);
  }
  public updateData(sales: Sales){
    return this.httpClient.put(`${this.uri}/sales`,sales);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/sales/${id}`);
  }
   public getData(){
    return this.httpClient.get<Sales[]>(`${this.uri}/sales`);
  }
  public filterByDateSales(daterange :string){
    return this.httpClient.post<Sales[]>(`${this.uri}/incomefilterbydate`,daterange);
  }
  public filterByBatchSales(batch:string){
    return this.httpClient.get<Sales[]>(`${this.uri}/incomefilterbybatch/${batch}`);
  }
  public filterByDateBatchSales(batch: string,daterange: string){
    return this.httpClient.post<Sales[]>(`${this.uri}/incomefilterbydatebatch/${batch}`,daterange);
  }
}
