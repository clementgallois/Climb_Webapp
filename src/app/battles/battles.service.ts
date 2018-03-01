import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class BattlesService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _http: Http) {}

  voteBattle(battle: any, vote: any) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem('token'));

    return this._http
      .post(
        this.baseUrl + '/battles/' + battle._id + '/vote',
        {vote: vote},
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  unvoteBattle(battle: any) {
    const headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem('token'));

    return this._http
      .delete(
        this.baseUrl + '/battles/' + battle._id + '/vote',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

  getProfileBattles() {
    const headers = new Headers();
    const username = localStorage.getItem('username');

    headers.append('Content-Type', 'application/json');
    headers.append('x-access-token', localStorage.getItem('token'));


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

  getFeedBattles() {
    const headers = new Headers();

    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('x-access-token', localStorage.getItem('token'));


    return this._http
      .get(
        this.baseUrl + '/battles/feed',
        { headers: headers }
      )
      .map(res => res.json())
      .map((res) => {
        return res;
      });
  }

}
