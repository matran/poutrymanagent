import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Flock } from '../models/flock';

@Injectable({
  providedIn: 'root'
})
export class FlockService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(flock: Flock){
    return this.httpClient.post(`${this.uri}/flock`,flock)
  }
  public updateData(flock: Flock){
    return this.httpClient.put(`${this.uri}/flock`,flock)
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/flock/${id}`)
  }
   public getData(){
    return this.httpClient.get<Flock[]>(`${this.uri}/flock`)
  }
  public changeStatus(flock : Flock){
    return this.httpClient.post(`${this.uri}/updatestatuschicks`,flock)
  }
  public getAllData(){
    return this.httpClient.get<Flock[]>(`${this.uri}/allchicks`)
  }
}
