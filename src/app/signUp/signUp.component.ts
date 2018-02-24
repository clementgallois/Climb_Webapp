import { Component, AfterViewInit, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { SignUpService } from './signUp.service';
import {NgForm} from '@angular/forms';

declare var $: any;
declare var gapi: any;
declare var FB: any;

@Component({
  selector : 'app-sign-up',
  templateUrl: './signUp.component.html',
  providers: [SignUpService]
})

export class SignUpComponent implements AfterViewInit, OnInit, OnDestroy {

  private username;
  private confirmPassword;
  private email;
  private password;
  private gender;

  public genders = [{'label': 'Male', 'name': 'male'},
                    {'label': 'Female', 'name': 'female'},
                    {'label': 'Other', 'name': 'other'}
                    ]
  public auth2: any;

  private error;
constructor(private _signUpService: SignUpService, private _route: ActivatedRoute, private _router: Router, private el: ElementRef) {
  FB.init({
    appId      : '1120118441421753',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });
  FB.AppEvents.logPageView();
}

onFacebookLoginClick() {
  FB.login((response) => {
    FB.api('/me', {fields: 'name,first_name,last_name,email,gender,picture'}, (resp) => {
      this._signUpService.facebookHandler(resp).subscribe((result) => {
        if (result.success) {
          this._router.navigateByUrl('/home/videos');
        } else {
            this.error = { message: 'La l\'inscription Facebook a échoué'};
        }
      });
    });
  }, {scope: 'email'});
}

onFacebookLogout() {
    FB.logout(function(response) {
    // user is now logged out
  });
}

statusChangeCallback(resp) {
      if (resp.status === 'connected') {
          // connect here with your server for facebook login by passing access token given by facebook
      } else {

      }
}

googleInit() {
  gapi.load('auth2', () => {
    this.auth2 = gapi.auth2.init({
      client_id: '668607930475-f9eh3cod33letpot7l3heepv0178t3ig.apps.googleusercontent.com',
      cookiepolicy: 'single_host_origin',
      scope: 'profile email'
    });
    this.attachSignin(document.getElementById('googleBtn'));
  });
}

attachSignin(element) {
  this.auth2.attachClickHandler(element, {},
    (googleUser) => {

        this._signUpService.googleHandler(googleUser).subscribe((result) => {
          if (result.success) {
            this._router.navigateByUrl('/home/videos');
            // window.location.reload();
          } else {
            this.error = { message: 'La l\'inscription Google a éhoué'};
          }
        });

    }, (error) => {
      alert(JSON.stringify(error, undefined, 2));
    });
}

onSubmit(f: NgForm) {
  this._signUpService.signUp(this.username, this.email, this.password, this.confirmPassword, this.gender).subscribe((result) => {
    if (result.success) {
      this._router.navigateByUrl('/home/videos');
    } else {

            this.error = { message: 'La l\'inscription a éhoué'};
      return;
    }
  });
}

onGenderChange(gender) {
  this.gender = gender;
}

  ngOnDestroy() {
      $.backstretch('destroy', false);
      $('#myModal1 .close').click();
      $('#myModal2 .close').click();
      $('body').removeClass('modal-open');
      $('.modal-backdrop').remove();
  }

  ngAfterViewInit() {

    this.googleInit();



    $.backstretch([
      [
        { 'width': 1280, 'fade': 4000, 'url': '../../assets/img/index/dance-1_1920.jpg' },
        { 'width': 960, 'fade': 4000, 'url': '../../assets/img/index/dance-1_1920.jpg' },
        { 'width': 480, 'fade': 4000, 'url': '../../assets/img/index/dance-1_1920.jpg' },
        { 'width': 0, 'fade': 4000, 'url': '../../assets/img/index/dance-1_1920.jpg' }
      ],
      [
        { 'width': 1280, 'fade': 4000, 'url': '../../assets/img/index/dance-3_1920.jpg' },
        { 'width': 960, 'fade': 4000, 'url': '../../assets/img/index/dance-3_1280.jpg' },
        { 'width': 480, 'fade': 4000, 'url': '../../assets/img/index/dance-3_480.jpg' },
        { 'width': 0, 'fade': 4000, 'url': '../../assets/img/index/dance-3_480.jpg' }
      ],
      [
        { 'width': 1280, 'fade': 4000, 'url': '../../assets/img/index/instrumental-1_1920.jpg' },
        { 'width': 960, 'fade': 4000, 'url': '../../assets/img/index/instrumental-1_1280.jpg' },
        { 'width': 480, 'fade': 4000, 'url': '../../assets/img/index/instrumental-1_480.jpg' },
        { 'width': 0, 'fade': 4000, 'url': '../../assets/img/index/instrumental-1_480.jpg' }
      ]
    ]);
    $('#myModal1').on('shown.bs.modal', function() {
      $('#autofocus-me').focus();
    });
    $('#myModal1').modal({ keyboard: false });
    $('#myModal1').on('hidden.bs.modal', function() {
      $('#myModal2').modal({ keyboard: true });
    });
    $('#myModal2').on('hidden.bs.modal', function() {
      $('#myModal1').modal({ keyboard: false });
    });
    $('#myModal2').click(function() {
      $('#modal-explain-close').click();
    });
    $(function() {
      $('#question-icon').tooltip();
      $('#question-icon').mouseover();
      setTimeout(function() {
        $('#question-icon').mouseout();
      }, 5000);
    });
  }

  ngOnInit() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  }

}
