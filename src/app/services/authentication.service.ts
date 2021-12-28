import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //private uri = 'http://127.0.0.1/api';
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public login(info: User){
    return this.httpClient.post(`${this.uri}/login`,info);
  }
  public register(info: User){
    return this.httpClient.post(`${this.uri}/users`,info);
  }
}
