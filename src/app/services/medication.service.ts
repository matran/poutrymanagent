import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Medication } from '../models/medication';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(medication: Medication){
    return this.httpClient.post(`${this.uri}/medication`,medication);
  }
  public updateData(medication: Medication){
    return this.httpClient.put(`${this.uri}/medication`,medication);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/medication/${id}`);
  }
   public getData(){
    return this.httpClient.get<Medication[]>(`${this.uri}/medication`);
  }
}
