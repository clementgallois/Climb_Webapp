import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { ProfileService } from '../../profile/profile.service';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import {NgForm} from '@angular/forms';
import { environment } from '../../../environments/environment';

declare var jQuery: any;

@Component({
  selector : 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class SettingsProfileComponent implements AfterViewInit {

  private baseUrl = environment.apiUrl;
  public user = {
    profile: {
    username: '',
    firstName: '',
    lastName: '',
    pictureUrl: '../../../assets/img/profile_picture.jpg',
    bio: '',
    gender: '' },
    local: {
      email: ''
    }
  };

  public genders = [{'label': 'Male', 'name': 'male'},
                    {'label': 'Female', 'name': 'female'},
                    {'label': 'Other', 'name': 'other'}
                    ]

  private selectedValue = '';

  private error;
  private success;
  private loading;
  private url = null;
  private isChanged = false;
  private photoFile = null;

constructor(private _service: ProfileService, private _http: Http,
  private router: Router,  private el: ElementRef, private route: ActivatedRoute) {
}

  ngAfterViewInit() {
    this._service.getProfileData(this.route.snapshot.params['username']).subscribe((result) => {
      if (result.success) {
        this.user = result.user;
        this.selectedValue = this.user.profile.gender;
        this.url = this.user.profile.pictureUrl;
      } else {
        alert('Authentification failed !');
      }
    });
  }

  onGenderChange(gender) {
    this.selectedValue = gender;
  }

  openNav() {
    document.getElementById('myNav').style.height = '100%';
}

/* Close when someone clicks on the "x" symbol inside the overlay */
  closeNav() {
    document.getElementById('myNav').style.height = '0%';
  }

  photoDelete() {
    alert('Delete !');
  }

  photoUpload(event) {

    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();

          reader.onload = (e: any) => {
              this.url = e.target.result;
            }

          reader.readAsDataURL(event.target.files[0]);
        }

          this.photoFile = event.target.files[0]  ;
          this.isChanged = true;
}

  onSubmit(f: NgForm) {

    const userName = this.user.profile.username;
    const firstName = this.user.profile.firstName;
    const lastName = this.user.profile.lastName;
    const gender = this.selectedValue;
    const bio = this.user.profile.bio;

    if (this.isChanged === true) {
      const headers = new Headers();
      const picture = new FormData();

      picture.append('image', this.photoFile)
      headers.append('x-access-token', localStorage.getItem('token'));
      // headers.append('Content-Type', 'multipart/form-data');
      this._http.post(this.baseUrl + '/profile/me/upload', picture, {headers: headers})
      .map((res: Response) => res.json()).subscribe(
                  // map the success function and alert the response
                   (success) => {
                           this.success = {message: 'Successfully updated profile'};
                  },
                  (error) => {
                    this.error = {message: 'Could not update profile'};
                  })
                }
    if (userName != null && firstName != null && lastName != null) {
      const formData = {
        'username': userName,
        'firstName': firstName,
        'lastName': lastName,
        'gender': gender,
        'bio': bio
      };
      const headers = new Headers();

        headers.append('x-access-token', localStorage.getItem('token'));
        headers.append('Content-Type', 'application/json');
        this._http.put(this.baseUrl + '/profile', JSON.stringify(formData), { headers: headers })
        .map((res: Response) => res.json()).subscribe(
                    // map the success function and alert the response
                     (success) => {
                           this.success = {message: 'Successfully updated profile'};
                    },
                    (error) => {
                    this.error = {message: 'Could not update profile'};
                  })

    }
  }

}
