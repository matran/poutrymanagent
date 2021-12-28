import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feeds } from '../models/feeds';

@Injectable({
  providedIn: 'root'
})
export class FeedsService {

  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(feeds: Feeds){
    return this.httpClient.post(`${this.uri}/feeds`,feeds);
  }
  public updateData(feeds: Feeds){
    return this.httpClient.put(`${this.uri}/feeds`,feeds);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/feeds/${id}`);
  }
   public getData(){
    return this.httpClient.get<Feeds[]>(`${this.uri}/feeds`);
  }
  public filterByDateFeeds(daterange :string){
    return this.httpClient.post<Feeds[]>(`${this.uri}/feedsfilterbydate`,daterange);
  }
  public filterByBatchFeeds(batch:string){
    return this.httpClient.get<Feeds[]>(`${this.uri}/feedsfilterbybatch/${batch}`);
  }
  public filterByDateBatchFeeds(batch: string,daterange: string){
    return this.httpClient.post<Feeds[]>(`${this.uri}/feedsfilterbydatebatch/${batch}`,daterange);
  }
}
