import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private CurrentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.CurrentUserSource.asObservable();
  model:any;

  
  constructor( private http:HttpClient ){}

  login( model:any){
    return this.http.post( this.baseUrl + '/account/login', model).pipe(
      map(
        (response:User) => {
          let user = response;
          if(user){
            localStorage.setItem('user', JSON.stringify(user));
            this.CurrentUserSource.next(user);
          }
        }
      )
    )
  }

  register(model:any){
    return this.http.post( this.baseUrl + '/account/register', model).pipe(
      map( 
        (user:User) => {
          if(user){
            localStorage.setItem('user', JSON.stringify(user))
            this.CurrentUserSource.next(user);
          }
        }
      )
    )
  }

  setCurrentUser(user:User){
    this.CurrentUserSource.next(user);
  }

  logout(){
    localStorage.removeItem('user');
    this.CurrentUserSource.next(null);
  }
}

