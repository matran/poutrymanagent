import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public getTotalIncome(){
    return this.httpClient.get(`${this.uri}/incometotal`);
   }
  public getTotalExpense(){
    return this.httpClient.get(`${this.uri}/expensetotal`);
   }
  public getBookingCount(date: string){
    return this.httpClient.get(`${this.uri}/bookingcount/${date}`);
  }
  public getTotalChicks(){
    return this.httpClient.get(`${this.uri}/totalchicks`);
  }
  public getTotalFeeds(){
    return this.httpClient.get(`${this.uri}/totalfeedsconsumed`);
  }
  public getTotalMortality(){
    return this.httpClient.get(`${this.uri}/totalmortality`);
  }
}
