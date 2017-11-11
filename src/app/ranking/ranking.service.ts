import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class RankingService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http){}

  getRankingLikes() {
    let headers = new Headers();
    let username = localStorage.getItem("username");

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem("token"));


    return this._http
      .get(
        this.baseUrl + '/ranking/likes',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

}
