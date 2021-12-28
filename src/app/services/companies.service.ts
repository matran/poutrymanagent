import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Companies } from '../models/companies';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
 private uri = 'https://poutry.herokuapp.com/api';
 constructor(private httpClient: HttpClient) { }
 public saveData(companies: Companies){
   return this.httpClient.post(`${this.uri}/companies`,companies);
 }
 public updateData(companies: Companies){
   return this.httpClient.put(`${this.uri}/companies`,companies);
 }
 public deleteData(id: number){
   return this.httpClient.delete(`${this.uri}/companies/${id}`);
 }
  public getData(){
   return this.httpClient.get<Companies[]>(`${this.uri}/companies`);
 }
}
