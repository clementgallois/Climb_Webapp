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

declare var FB:any;
declare var gapi:any;

@Injectable()
export class AuthService {

  private loggedIn = false;
  private baseUrl = environment.apiUrl;

  constructor(
    private _router: Router,
    private _http: Http){}

    facebookHandler(response) {
            if (response.email) {
              var name = response.name;
              var firstName = response.first_name;
              var last_name = response.last_name;
              var pictureUrl = response.picture.data.url;
              var gender = response.gender;
              var email = response.email;
              var route = "facebook";
              let headers = new Headers();
              headers.append('Content-Type', 'application/json');
              console.log('Going to send the api request');
              name = name.split(' ').join('')
              console.log(name)
              return this._http.post(
                this.baseUrl + '/register',
                JSON.stringify({'name': name, 'firstName': firstName, 'lastName': last_name ,'email': email,
                'pictureUrl': pictureUrl, 'gender': gender, 'route': route}),
                 {headers}
                ).map(res => res.json())
                .map((res) => {
                  console.log('res', res)
                  console.log('Avant de print res')
                  if (res.success) {
                  console.log("Registration Successful !");
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('username', res.user.profile.username);
                  }
                console.log('Res -> ' + JSON.stringify(res))
                  console.log('Return res')
                return res;
              });
            }
            else {
              alert("It seems that you didn't confirm the email address you use with Facebook :)")
            }
  }

  googleHandler(googleUser) {
    let profile = googleUser.getBasicProfile();
    var name = profile.getName();
    var email = profile.getEmail();
    var pictureUrl = profile.getImageUrl();
    var route = 'google';
    console.log('name', name)
    console.log(name + email + pictureUrl)
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log('Going to send the api request');
    name = name.split(' ').join('')
    console.log('name', name)
    return this._http.post(
      this.baseUrl + '/register',
      JSON.stringify({'name': name, 'email': email,
      'pictureUrl': pictureUrl, 'route': route}),
       {headers}
      ).map(res => res.json())
      .map((res) => {
        console.log(res)
        console.log('Avant de print res')
        if (res.success) {
        console.log("Registration Successful !");
        localStorage.setItem('token', res.token);
        localStorage.setItem('username', res.user.profile.username);
        }
      console.log('Res -> ' + JSON.stringify(res))
        console.log('Return res')
      return res;
    });
}

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  }

  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this._http
      .post(
        this.baseUrl + '/authenticate',
        JSON.stringify({ 'email': email, 'password': password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        console.log(res);
        if (res.success) {
          console.log("Authentification Successful !");
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', res.user.profile.username);
          this.loggedIn = true;
        }

        return res;
      });
  }

  isLoggedIn() {
    return this.loggedIn;
  }

   checkCredentials() {
    if (localStorage.getItem("token") === null){
        this.loggedIn = false;
        this._router.navigate(['login']);
    }
  }
}
