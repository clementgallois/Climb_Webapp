import { Component, AfterViewInit, ElementRef} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(private _http: Http,
    private el: ElementRef,
    private _videosService: VideosService,
  private router: Router,
private route: ActivatedRoute, ) {
    FB.init({
      appId      : '1120118441421753',
      cookie     : true,
      xfbml      : true,
      version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
  }

  ngAfterViewInit() {
    // hotfix
    const curRoute = this.router.url.split('/')[1];
    console.log(curRoute)
    if (curRoute === 'home') {
      this._videosService.getFeedVideos().subscribe((result) => {
        if (result.success) {
          this.videos = result.videos;
          const userId = localStorage.getItem('userId')
          this.videos.forEach(e => e.isOwner = e.ownerId._id === userId)
        }
      });
    } else if (curRoute === 'profile') {
    this.route.parent.url.subscribe((urlPath) => {
      const username = urlPath[1].path
        this._videosService.getProfileVideos(username).subscribe((result) => {
          if (result.success) {
            this.videos = result.videos;
            const userId = localStorage.getItem('userId')
            this.videos.forEach(e => e.isOwner = e.ownerId._id === userId)
          }
        });
    });
  }
}

}
