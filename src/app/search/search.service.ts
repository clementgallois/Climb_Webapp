import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

@Injectable()
export class SearchService {
  private baseUrl = environment.apiUrl;

  constructor(private _http: Http){
  }

  search(value) {
    const headers = new Headers();
    headers.append('x-access-token', localStorage.getItem("token"));
    headers.append('Content-Type', 'application/json');
    return this._http.post(this.baseUrl + '/search', JSON.stringify({'search': value}), {headers})
    .map(res => res.json())
    .map((res) => {
      return res
    })
  }

}
