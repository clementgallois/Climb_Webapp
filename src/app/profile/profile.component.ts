import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from './profile.service';

import { Http, Headers, RequestOptionsArgs } from '@angular/http';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ProfileService]
})

export class ProfileComponent implements AfterViewInit {

  private open = false;
  private pictureProfil = './../assets/img/profile_picture.jpg';
  private id = '';
  private firstName = '';
  private lastName = '';
  private followers = 0;
  private following = 0;
  private battles = 0;
  private videos = 0;
  private username = '';
  private bio = '';
  private isFollowing = false;
  private isOwner = false;
  private user = this.route.snapshot.params['username'] || 'bongo';
  private baseUrl = environment.apiUrl;

  constructor(private _service: ProfileService, private router: Router,
    private route: ActivatedRoute, private el: ElementRef,
    private _http: Http) {}

  ngAfterViewInit() {
    this._service.getProfileData(this.user).subscribe((result) => {
      if (result.success) {

        this.pictureProfil = result.user.profile.pictureUrl;
        this.firstName = result.user.profile.firstName;
        this.lastName = result.user.profile.lastName;
        this.username = result.user.profile.username;
        this.followers = result.followers;
        this.following = result.following;
        this.bio = result.user.profile.bio;
        this.id = result.user._id;
        this.videos = 0;
        this.battles = 0;
        this.username = result.user.profile.username;
        this.isOwner = result.isOwner;
        this.isFollowing = result.isFollowing;
      } else {
        console.log(result);
      }
    });
  }
  follow() {
    this._service.follow(this.user).subscribe((result) => {
      window.location.reload();
    });
  }
  unfollow() {
    this._service.unfollow(this.user).subscribe((result) => {
      window.location.reload();
    });
  }

   sendMsg(msg) {
    this.open = true;
    const message: HTMLInputElement = this.el.nativeElement.querySelector('#message').value;
    if (message != null) {
        const formData = {
        'message': message,
        'sendTo': this.id
      };
      const headers = new Headers();
      headers.append('x-access-token', localStorage.getItem('token'));
      headers.append('Content-Type', 'application/json');
      this._http.post(this.baseUrl + '/chat/', JSON.stringify(formData), { headers: headers })
      .map((res) => res.json()).subscribe(
                                // map the success function and alert the response
                                 (success) => {
                                         console.log('success'); this.router.navigateByUrl('/profile/messages');
                                },
                                (error) => alert('error'));
    }
  }
}
