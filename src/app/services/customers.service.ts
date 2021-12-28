import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customers } from '../models/customers';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(customers: Customers){
    return this.httpClient.post(`${this.uri}/customers`,customers);
  }
  public updateData(customers: Customers){
    return this.httpClient.put(`${this.uri}/customers`,customers);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/customers/${id}`);
  }
   public getData(){
    return this.httpClient.get<Customers[]>(`${this.uri}/customers`);
  }
}
