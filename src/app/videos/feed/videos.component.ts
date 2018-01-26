import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { VideosService } from '../videos.service';
import { environment } from '../../../environments/environment';

declare var FB: any;

@Component({
  selector: 'app-feed-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosFeedComponent implements AfterViewInit {

  constructor(private _http: Http,private el: ElementRef,private _videosService: VideosService){
    FB.init({
      appId      : '1120118441421753',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  }

  private error;
  private success;
  private loading;
  private baseUrl = environment.apiUrl;
  private videos = [];
  private challengedVideoId;
  private competitorVideoId;

  ngAfterViewInit() {
    this._videosService.getFeedVideos().subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
        console.log(this.videos);
      }
    });
  }

  like(video: any) {
    this._videosService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      }
    });
  }

  unlike(video: any) {
    this._videosService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      }
    });
  }

  challenge(video: any) {
    this.challengedVideoId = video._id;
  }

  share(video: any){

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
