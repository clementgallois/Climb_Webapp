import { Component,  ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { environment } from '../../environments/environment';
@Component({
  selector : 'app-home',
  templateUrl: './upload.component.html'
})

export class UploadComponent {

  private loading: boolean;
  private error;
  private success;
  private video: File = null;
  private baseUrl = environment.apiUrl;
    constructor(
    private _router: Router,
    private _http: Http,
     private el: ElementRef) {}

  submit() {

    this.error = null;
    this.success = null;
    const video: HTMLInputElement = this.el.nativeElement.querySelector('#video').files.item(0);
    const title: HTMLInputElement = this.el.nativeElement.querySelector('#title').value;
    const description: HTMLInputElement = this.el.nativeElement.querySelector('#description').value;
    const formData = new FormData();
    if (video != null && title != null) {
      this.loading = true;
      formData.append('video', video);
      formData.append('title', title);
      if (description != null) {
      formData.append('description', description);
    }
      const headers = new Headers();

        headers.append('x-access-token', localStorage.getItem('token'));
      this._http.post(this.baseUrl + '/videos/upload', formData, { headers: headers })
      .map((res: Response) => res.json()).subscribe(
                  // map the success function and alert the response
                   (success) => {
                           this.success = {message: 'Video added'};
                           this.loading = false;
                           this._router.navigate(['/video', success.video._id ]);
                  },
                  (error) => {
                    this.error = {message: 'Failed adding video'};
                    this.loading = false;

                  });
    } else {
     this.error = {message: 'Fields title and video are required'};
   }

  }

  handleFileInput(files: FileList) {
    this.video = files.item(0);
  }
}
