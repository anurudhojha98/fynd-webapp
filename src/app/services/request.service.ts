import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  baseUrl:string=environment.apiUrl;
  authUrl:string=environment.authUrl;
  private $loginSubject = new Subject();
  private $logoutSubject = new Subject();
  constructor(
    private http:HttpClient
  ) { }

  login(payload):Observable<any>{
    return this.http.post(this.baseUrl+'/user/login',payload);
  }

  getMovieList(filter,searchParams):Observable<any>{
    return this.http.post(this.baseUrl+'/movie-list',{filter},{params:searchParams});
  }

  addMovie(payload):Observable<any>{
    return this.http.post(this.baseUrl+'/movie',payload);
  }

  updateMovie(id,payload):Observable<any>{
    return this.http.put(this.baseUrl+`/movie/${id}`,payload);
  }

  deleteMovie(id,payload):Observable<any>{
    return this.http.request('delete',this.baseUrl+`/movie/${id}`,{ body: payload });
  }

  setLogin(val) {
    this.$loginSubject.next(val);
  }

  /**
   * function to get login event value
   */
  get loginObservable() {
    return this.$loginSubject.asObservable();
  }

  setLogout(val) {
    this.$logoutSubject.next(val);
  }

  /**
   * function to get login event value
   */
  get logoutObservable() {
    return this.$logoutSubject.asObservable();
  }

}
