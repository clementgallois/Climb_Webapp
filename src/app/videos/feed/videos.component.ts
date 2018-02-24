import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { VideosService } from '../videos.service';
import { environment } from '../../../environments/environment';

declare var FB: any;

@Component({
  selector: 'app-feed-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  providers: [VideosService],
})
export class VideosFeedComponent implements AfterViewInit {
  private error;
  private success;
  private loading;
  private baseUrl = environment.apiUrl;
  private videos = [];
  private challengedVideoId;
  private competitorVideoId;

  constructor(private _http: Http, private el: ElementRef, private _videosService: VideosService) {
    FB.init({
      appId      : '1120118441421753',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  }

  ngAfterViewInit() {
    this._videosService.getFeedVideos().subscribe((result) => {
      if (result.success) {
        this.videos = result.videos;
        console.log(this.videos);
      }
    });
  }

}
