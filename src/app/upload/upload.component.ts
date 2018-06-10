import { Component,  ElementRef, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { environment } from '../../environments/environment';
@Component({
  selector : 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})

export class UploadComponent implements OnInit {
  private loading: boolean;
  private thumbnailSelect: false;
  private error;
  private success;
  private video: File = null;
  private baseUrl = environment.apiUrl;
  private thumbURL = null;
  private challengedVideoId = null;

  constructor(
    private _router: Router,
    private _http: Http,
    private el: ElementRef,
    public bsModalRef: BsModalRef
  ) {}


  onNotify(message) {
    console.log('newthumb')
    console.log(message)
    this.thumbURL = message;
    this.thumbnailSelect = false;
  }
  ngOnInit() {
      console.log(this.challengedVideoId)
    }
  submit() {
    console.log('submit')
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
      if (this.thumbURL !== null) {
        formData.append('thumbnailUrl', this.thumbURL)
      }
      const headers = new Headers();

        headers.append('x-access-token', localStorage.getItem('token'));
      this._http.post(this.baseUrl + '/videos/upload', formData, { headers: headers })
      .map((res: Response) => res.json()).subscribe(
                  // map the success function and alert the response
                   (success) => {
                      if (this.challengedVideoId) {
                        this.battleUpload(success)
                      } else {
                        this.success = {message: 'Video added'};
                        this.loading = false;
                        console.log('navigate now', success.video._id)
                        this.bsModalRef.hide()
                        setTimeout(() => { this._router.navigate(['/video', success.video._id ]) }, 500);
                      }
                  },
                  (error) => {
                    this.error = {message: 'Failed adding video'};
                    this.loading = false;

                  });
    } else {
     this.error = {message: 'Fields title and video are required'};
   }
  }

  battleUpload(data) {
    const competitorVideoId = data.video._id;
    const headers = new Headers();
    headers.append('x-access-token', localStorage.getItem('token'));
    headers.append('Content-Type', 'application/json');
    this._http.post(this.baseUrl + '/battle', JSON.stringify({'video_1': this.challengedVideoId,
    'video_2': competitorVideoId}), {headers: headers})
    .map((res: Response) => res.json()).subscribe(
                 (success) => {
                   this.success = {message: 'Battle added'};
                   this.loading = false;
                   this.bsModalRef.hide()
                  },
                 (error) => {
                   this.error = {message: 'Failed adding video'};
                   this.loading = false;
                 }
               );
  }

  handleFileInput(files: FileList) {
    this.video = files.item(0);
  }
}
