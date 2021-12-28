import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateRange } from '../models/date-range';
import { FeedsReport } from '../models/feeds-report';
import { MortalityReport } from '../models/mortality-report';
import { Reports } from '../models/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private uri = 'https://poutry.herokuapp.com/api';
  //private uri = 'http://127.0.0.1/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(reports: Reports){
    return this.httpClient.post(`${this.uri}/reports`,reports);
  }
  public updateData(reports: Reports){
    return this.httpClient.put(`${this.uri}/reports`,reports);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/reports/${id}`);
  }
   public getData(){
    return this.httpClient.get<Reports[]>(`${this.uri}/expenseincome`);
  }


  public getDataFeedsReports(){
    return this.httpClient.get<Reports[]>(`${this.uri}/feedsreports`);
  }

  public getDataMortalityReports(){

    return this.httpClient.get<Reports[]>(`${this.uri}/mortalityreports`);

  }

  public findTotalIncome(){
    return this.httpClient.get(`${this.uri}/incomereporttotal`);
    
  }
  public findTotalExpense(){
    return this.httpClient.get(`${this.uri}/expensesreporttotal`);
  }

  public findTotalMortality(){
    return this.httpClient.get<Reports[]>(`${this.uri}/totalmortalityperiod`);
  }

  public findTotalFeeds(){
    return this.httpClient.get<Reports[]>(`${this.uri}/feedstotalperiod`);
  }

  
  public filterByDateMortality(daterange :string){
    return this.httpClient.post<MortalityReport[]>(`${this.uri}/mortalityreports`,daterange);
  }
  public filterByBatchMortality(batch:string){
    return this.httpClient.get<MortalityReport[]>(`${this.uri}/mortalitybatch/${batch}`);
  }


  public filterByDateBatchMortality(batch: string,daterange: string){
    return this.httpClient.post<MortalityReport[]>(`${this.uri}/mortalitybatchdate/${batch}`,daterange);
  }

  public filterByDateFeeds(daterange :string){
    return this.httpClient.post<FeedsReport[]>(`${this.uri}/feedsdateperiod`,daterange);
  }
  public filterByBatchFeeds(batch:string){
    return this.httpClient.get<FeedsReport[]>(`${this.uri}/feedsbatch/${batch}`);
  }
  public filterByDateBatchFeeds(batch: string,daterange: string){
    return this.httpClient.post<FeedsReport[]>(`${this.uri}/feedsbatchdate/${batch}`,daterange);
  }

  public filterByDateIncomeExpense(daterange :DateRange){
    return this.httpClient.post<Reports[]>(`${this.uri}/expenseincomebydate`,daterange);
  }
  public filterByDateBatchIncomeExpense(daterange :DateRange){
    return this.httpClient.post<Reports[]>(`${this.uri}/expenseincomebybatchdate`,daterange);
  }

  public filterByBatchIncomeExpense(batch: string){
    return this.httpClient.get<Reports[]>(`${this.uri}/expenseincomebybatch/${batch}`);
  }
 
}
