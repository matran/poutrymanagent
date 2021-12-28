import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Companies } from '../models/companies';
import { Mortality } from '../models/mortality';

@Injectable({
  providedIn: 'root'
})
export class MortalityService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(mortality: Mortality){
    return this.httpClient.post(`${this.uri}/mortality`,mortality);
  }
  public updateData(mortality: Mortality){
    return this.httpClient.put(`${this.uri}/mortality`,mortality);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/mortality/${id}`);
  }
   public getData(){
    return this.httpClient.get<Mortality[]>(`${this.uri}/mortality`);
  }
  public filterByDateMortality(daterange :string){
    return this.httpClient.post<Mortality[]>(`${this.uri}/mortalityfilterbydate`,daterange);
  }
  public filterByBatchMortality(batch:string){
    return this.httpClient.get<Mortality[]>(`${this.uri}/mortalityfilterbybatch/${batch}`);
  }
  public filterByDateBatchMortality(batch: string,daterange: string){
    return this.httpClient.post<Mortality[]>(`${this.uri}/mortalityfilterbydatebatch/${batch}`,daterange);
  }
}
