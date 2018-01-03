import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { VideosService } from '../../videos/videos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

declare var FB: any;

@Component({
  selector: 'app-profile-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class ProfileVideosComponent implements AfterViewInit {

private baseUrl = environment.apiUrl;
  constructor(private _router: Router,
  private _http: Http,
   private el: ElementRef,
   private _videosService: VideosService,
   private route: ActivatedRoute){
     FB.init({
       appId      : '1120118441421753',
       cookie     : true,
       xfbml      : true,
       version    : 'v2.8'
     });
     FB.AppEvents.logPageView();
   }

  private videos = [];
  private userProfilePicture = '';
  private ownerUsername = '';
  private challengedVideoId;
  private competitorVideoId;

  ngAfterViewInit() {
    this._videosService.getProfileVideos(this.route.snapshot.params["username"]).subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
      } else {
        alert('Videos profile failed');
      }
    });
  }

  like(video: any) {
    this._videosService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      } else {
        alert('Video like failed');
      }
    });
  }

  unlike(video: any) {
    this._videosService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      } else {
        alert('Video unlike failed');
      }
    });
  }

  challenge(video: any) {
    this.challengedVideoId = video._id;
  }

  share(video: any){
    FB.ui({
    method: 'share',
    display: 'popup',
    href: 'https://google.com',
  }, function(response){});
  }

  submit() {
    alert("challengedVideoId -> " + this.challengedVideoId)
    let video: HTMLInputElement = this.el.nativeElement.querySelector('#video').files.item(0);
  	let title: HTMLInputElement = this.el.nativeElement.querySelector('#title').value;
  	let description: HTMLInputElement = this.el.nativeElement.querySelector('#description').value;
  	let formData = new FormData();
  	if (video != null && title != null){
  		formData.append('video', video);
  		formData.append('title', title);
  		if (description != null)
  			formData.append('description', description);
  		let headers = new Headers();

      	headers.append('x-access-token', localStorage.getItem("token"));
      	alert(formData);
  		return this._http.post(this.baseUrl + "/videos/upload", formData, { headers: headers })
        .map(res => res.json())
        .map((res) => {
          if (res.success) {
            this.competitorVideoId = res.video._id
          }
      });
    }
    let formData2 = new FormData();
    formData.append('video_1', this.challengedVideoId);
    formData.append('video_2', this.competitorVideoId);
    let headers = new Headers();
    headers.append('x-access-token', localStorage.getItem("token"));
    this._http.post(this.baseUrl + "/battle", formData2, {headers: headers})
    .map((res:Response) => res.json()).subscribe(
                //map the success function and alert the response
                 (success) => {
                         alert("success");
                },
                (error) => alert("error"))
  }

}
