import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  private baseUrl = environment.apiUrl;
  constructor(private _http: Http) { }


  getConversations() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem('token'));

    console.log(this.baseUrl + '/chat/')
    return this._http
      .get(
        this.baseUrl + '/chat/',
        { headers: headers }
      )
      .map(res => { return res.json()})
      .map((res) => {
        return res;
      });

  }

  getChat(convId) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem('token'));

    return this._http
      .get(
        this.baseUrl + '/chat/' + convId,
        { headers: headers }
      )
      .map(res => { return res.json()})
      .map((res) => {
        return res;
      });
    }
  // getConversations() {
  //   return new Promise((resolve, reject) => {
  //     this.http.get('/chat/')
  //       .map(res => res.json())
  //       .subscribe(res => {
  //         resolve(res);
  //       }, (err) => {
  //         reject(err);
  //       });
  //   });
  // }

  // sendChat(data) {
  //   return new Promise((resolve, reject) => {
  //       this.http.post('/chat', data)
  //         .map(res => res.json())
  //         .subscribe(res => {
  //           resolve(res);
  //         }, (err) => {
  //           reject(err);
  //         });
  //   });
  // }

}
