import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { VideosService } from '../../videos/videos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class ProfileOtherVideosComponent implements AfterViewInit {

private baseUrl = environment.apiUrl;
  constructor(private _router: Router,
  private _http: Http,
   private el: ElementRef,
   private _videosService: VideosService,
   private route: ActivatedRoute){}

  private error;
  private success;
  private loading;
  private videos = [];
  private userProfilePicture = '';
  private ownerUsername = '';
  private challengedVideoId;
  private competitorVideoId;
  private user;

  ngAfterViewInit() {
    this.route.parent.url.subscribe((urlPath) => this.user = urlPath[1].path)
    this._videosService.getProfileVideos(this.user).subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
      } else {
        console.log(result)
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

  submit() {

    this.error = null;
    this.success = null;
    let video: HTMLInputElement = this.el.nativeElement.querySelector('#video').files.item(0);
  	let title: HTMLInputElement = this.el.nativeElement.querySelector('#title').value;
  	let description: HTMLInputElement = this.el.nativeElement.querySelector('#description').value;
  	let formData = new FormData();
  	if (video != null && title != null){
      this.loading=true
  		formData.append('video', video);
  		formData.append('title', title);
  		if (description != null)
  			formData.append('description', description);
  		let headers = new Headers();

      	headers.append('x-access-token', localStorage.getItem("token"));
  		this._http.post(this.baseUrl + "/videos/upload", formData, { headers: headers })
  		.map((res:Response) => res.json()).subscribe(
                  //map the success function and alert the response
                  data => function (challengedVideoId, _http, baseUrl) {
                    var competitorVideoId = data.video._id;
                    let headers2 = new Headers();
                    headers2.append('x-access-token', localStorage.getItem("token"));
                    headers2.append('Content-Type', 'application/json');
                    _http.post(baseUrl + "/battle", JSON.stringify({'video_1': challengedVideoId,
                    'video_2': competitorVideoId}), {headers: headers2})
                    .map((res:Response) => res.json()).subscribe(
                                //map the success function and alert the response
                                 (success) => {
                           this.success = {message: "Video added"};
                           this.loading=false;
                                },
                                (error) => {
                                
                    this.error = {message: "Failed adding video"};
                    this.loading=false;

                                })
                  }.bind(this)(this.challengedVideoId, this._http, this.baseUrl),
                );
        }

    else{
     this.error = {message: "Fields title and video are required"};
   }
      }

}
