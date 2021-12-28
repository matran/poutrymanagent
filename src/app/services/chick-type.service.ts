import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChickType } from '../models/chick-type';

@Injectable({
  providedIn: 'root'
})
export class ChickTypeService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(chicktype: ChickType){
    return this.httpClient.post(`${this.uri}/chicktype`,chicktype);
  }
  public updateData(chicktype: ChickType){
    return this.httpClient.put(`${this.uri}/chicktype`,chicktype);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/chicktype/${id}`);
  }
   public getData(){
    return this.httpClient.get<ChickType[]>(`${this.uri}/chicktype`);
  }
}
