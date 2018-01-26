import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';

import 'rxjs/add/operator/map';
import localStorage from 'localStorage';

declare var FB:any;
declare var gapi:any;

@Injectable()
export class SignUpService {

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
              name = name.split(' ').join('')
              return this._http.post(
                this.baseUrl + '/register',
                JSON.stringify({'name': name, 'firstName': firstName, 'lastName': last_name ,'email': email,
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
    let profile = googleUser.getBasicProfile();

    var name = profile.getName();
    var email = profile.getEmail();
    var pictureUrl = profile.getImageUrl();
    var route = 'google';
    let headers = new Headers();
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
      let headers = new Headers();
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
          let headers = new Headers();
          headers.append('x-access-token', localStorage.getItem("token"));
          headers.append('Content-Type', 'application/json');
          this._http.put(this.baseUrl + "/profile", JSON.stringify({ 'gender': gender }), { headers: headers })
          .map((res) => res.json()).subscribe(
                      //map the success function and alert the response
                       (success) => {
                      })
        }

        return res;
      });
    }

}
