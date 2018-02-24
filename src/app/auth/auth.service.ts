import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

export class User {
  constructor(
    public email: string,
    public password: string) { }
}

declare var FB: any;
declare var gapi: any;

@Injectable()
export class AuthService {

  private loggedIn = false;
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
              name = name.split(' ').join('');
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
                  localStorage.setItem('userId', res.user._id);
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
    name = name.split(' ').join('');
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
        localStorage.setItem('userId', res.user._id);
        }
      return res;
    });
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  }

  login(email, password) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .post(
        this.baseUrl + '/authenticate',
        JSON.stringify({ 'email': email, 'password': password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.user.profile.username);
          localStorage.setItem('userId', res.user._id);
          this.loggedIn = true;
        }

        return res;
      });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

   checkCredentials() {
    if (localStorage.getItem('token') === null) {
        this.loggedIn = false;
        this._router.navigate(['login']);
    }
  }
}
