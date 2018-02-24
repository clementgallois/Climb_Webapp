import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

declare var FB: any;
declare var gapi: any;

@Injectable()
export class SignUpService {

  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http) {}

    facebookHandler(response) {
            if (response.email) {
              let name = response.name;
              const firstName = response.first_name;
              const last_name = response.last_name;
              const pictureUrl = response.picture.data.url;
              const gender = response.gender;
              const email = response.email;
              const route = 'facebook';
              const headers = new Headers();
              headers.append('Content-Type', 'application/json');
              name = name.split(' ').join('')
              return this._http.post(
                this.baseUrl + '/register',
                JSON.stringify({'name': name, 'firstName': firstName, 'lastName': last_name , 'email': email,
                'pictureUrl': pictureUrl, 'gender': gender, 'route': route}),
                 {headers}
                ).map(res => res.json())
                .map((res) => {
                  if (res.success) {
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('username', res.user.profile.username);
                  }
                return res;
              });
            }
  }

  googleHandler(googleUser) {
    const profile = googleUser.getBasicProfile();

    let name = profile.getName();
    const email = profile.getEmail();
    const pictureUrl = profile.getImageUrl();
    const route = 'google';
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    name = name.split(' ').join('')
    return this._http.post(
      this.baseUrl + '/register',
      JSON.stringify({'name': name, 'email': email,
      'pictureUrl': pictureUrl, 'route': route}),
       {headers}
      ).map(res => res.json())
      .map((res) => {
        if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.profile.username);
        }
      return res;
    });
}

    signUp(username, email, password, confirmPassword, gender) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this._http.post(
        this.baseUrl + '/register',
        JSON.stringify({'username': username, 'email': email, 'password': password, 'confirmPassword': confirmPassword }),
        { headers }
      ).map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.user.profile.username);
          const header = new Headers();
          header.append('x-access-token', localStorage.getItem('token'));
          header.append('Content-Type', 'application/json');
          this._http.put(this.baseUrl + '/profile', JSON.stringify({ 'gender': gender }), { headers: headers })
          .map((response) => response.json()).subscribe(
                      // map the success function and alert the response
                       (success) => {
                      })
        }

        return res;
      });
    }

}
