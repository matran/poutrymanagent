import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Orders } from '../models/orders';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(orders: Orders){
    return this.httpClient.post(`${this.uri}/orders`,orders);
  }
  public updateData(orders: Orders){
    return this.httpClient.put(`${this.uri}/orders`,orders);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/orders/${id}`);
  }
   public getData(){
    return this.httpClient.get<Orders[]>(`${this.uri}/orders`);
  }
}
