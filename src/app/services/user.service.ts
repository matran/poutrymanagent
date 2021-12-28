import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uri = 'https://poutry.herokuapp.com/api';
  constructor(private httpClient: HttpClient) { }
  public createUser(user: User){
    return this.httpClient.post(`${this.uri}/users`,user);
  }
  public updatePassword(user: User){
    return this.httpClient.post(`${this.uri}/changepassword`,user);
  }

  public updateUser(user: User){
    return this.httpClient.put(`${this.uri}/users`,user);
  }
  public deleteUser(id: number){
    return this.httpClient.delete(`${this.uri}/users/${id}`);
  }
  public getUserById(id: number){
    return this.httpClient.get(`${this.uri}/users/${id}`);
  }
  public getUsers(category:string){
    return this.httpClient.get<User[]>(`${this.uri}/allusers/${category}`);
  }
  public getPackager(){
    return this.httpClient.get<User[]>(`${this.uri}/packager`);
  }

}
