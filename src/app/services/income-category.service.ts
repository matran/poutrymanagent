import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IncomeCategory } from '../models/income-category';

@Injectable({
  providedIn: 'root'
})
export class IncomeCategoryService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public saveData(incomecategory: IncomeCategory){
    return this.httpClient.post(`${this.uri}/incomecategory`,incomecategory);
  }
  public updateData(incomecategory: IncomeCategory){
    return this.httpClient.put(`${this.uri}/incomecategory`,incomecategory);
  }
  public deleteData(id: number){
    return this.httpClient.delete(`${this.uri}/incomecategory/${id}`);
  }
   public getData(){
    return this.httpClient.get<IncomeCategory[]>(`${this.uri}/incomecategory`);
  }
}
