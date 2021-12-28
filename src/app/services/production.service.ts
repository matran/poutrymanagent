import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Production } from '../models/production';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(production:  Production){
    return this.httpClient.post(`${this.uri}/production`,production);
  }
  public updateData(production:  Production){
    return this.httpClient.put(`${this.uri}/production`,production);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/production/${id}`);
  }
   public getData(){
    return this.httpClient.get<Production[]>(`${this.uri}/production`);
  }
}
