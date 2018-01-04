import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class ProfileService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http){}

  getProfileData(username) {
    let headers = new Headers();
    if (username === undefined)
      username = localStorage.getItem("username");
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));
    console.log(headers)

    return this._http
      .get(
        this.baseUrl + '/profile/' + username,
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  getProfileVideos(username) {
    let headers = new Headers();
    if (username === undefined)
      username = localStorage.getItem("username");

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));
    return this._http
      .get(
        this.baseUrl + '/profile/' + username + '/videos',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  follow(username) {
    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));

    return this._http.post(this.baseUrl + '/profile/follow/' + username,
    {token: localStorage.getItem("token")})
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  unfollow(username) {
    console.log('unfollow');
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));
    return this._http
      .delete(
        this.baseUrl + '/profile/follow/' + username,
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
    }
}
