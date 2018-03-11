import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { VideoService } from './video.service';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../environments/environment';

declare var FB: any;

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: [VideoService],
})

export class VideoComponent implements AfterViewInit {
  @Input() video: any = undefined;
  private error;
  private success;
  private loading;
  private baseUrl = environment.apiUrl;
  private comments;
  private challengedVideoId;
  private competitorVideoId;

  constructor(private _http: Http, private el: ElementRef,
    private route: ActivatedRoute, private _videoService: VideoService) {
      FB.init({
        appId      : '1120118441421753',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.8'
      });
      FB.AppEvents.logPageView();
    }


  ngAfterViewInit() {

  if (!this.video) {
  this.route.paramMap
    .switchMap((params: ParamMap) => {console.log(params); return this._videoService.getVideo(params.get('id'))})
    .subscribe((result) => {
      if (result.success) {
        this.video = result.video;
        this.comments = result.comments;
      }
    });
  }
}

  like(video: any) {
    this._videoService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      }
    });
  }

  unlike(video: any) {
    this._videoService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      }
    });
  }

  challenge(video: any) {
    this.challengedVideoId = video._id;
  }

  postComment() {
    const commentText = HTMLInputElement = this.el.nativeElement.querySelector('#commentText').value;
    if (commentText != null) {
        const formData = {
        'commentText': commentText,
      };
      const headers = new Headers();
      headers.append('x-access-token', localStorage.getItem('token'));
        headers.append('Content-Type', 'application/json');
      this._http.post(this.baseUrl + '/videos/' + this.video._id + '/comment', JSON.stringify(formData), { headers: headers })
      .map((res: Response) => res.json()).subscribe(
                                // map the success function and alert the response
                                 (success) => {
                                         window.location.reload();
                                },
                                (error) => {
                                   this.error = {message: 'Failed to add comment'};
                                });
    }
  }

  share(video: any) {
    FB.ui({
    method: 'share',
    display: 'popup',
    href: window.location.href,
  }, function(response) {});
  }

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
                  data => function (challengedVideoId, _http, baseUrl) {
                    const competitorVideoId = data.video._id;
                    const headers2 = new Headers();
                    headers2.append('x-access-token', localStorage.getItem('token'));
                    headers2.append('Content-Type', 'application/json');
                    _http.post(baseUrl + '/battle', JSON.stringify({'video_1': challengedVideoId,
                    'video_2': competitorVideoId}), {headers: headers2})
                    .map((res: Response) => res.json()).subscribe(
                                 (success) => {
                           this.success = {message: 'Video added'};
                           this.loading = false;
                                },
                                (error) => {

                    this.error = {message: 'Failed adding video'};
                    this.loading = false;
                                });
                  }.bind(this)(this.challengedVideoId, this._http, this.baseUrl),
                );
        }
     this.error = {message: 'Fields title and video are required'};
      }

}
