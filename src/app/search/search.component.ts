import { Component, AfterViewInit, ElementRef} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { SearchService } from './search.service';


declare var jQuery:any;

@Component({
  selector : 'app-search',
  templateUrl: './search.component.html',
  providers: [SearchService],
  styleUrls: ['./search.component.css']
})

export class SearchComponent {
  private baseUrl = environment.apiUrl;
  private users = [];
  private videos = [];
  private challengedVideoId;
  private competitorVideoId;
  constructor(private _http: Http,private el: ElementRef, private _activateRoute: ActivatedRoute, private _searchService: SearchService, private router: Router){
    this._activateRoute.params.subscribe(
          (param: any) => {
            this._searchService.search(param.value).subscribe((search) => {
              this.users = search.users;
              this.videos = search.videos;
            });
    });
  }
  like(video: any) {
    this._searchService.likeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = true;
        video.likes += 1;
      }
    });
  }

  unlike(video: any) {
    this._searchService.unlikeVideo(video).subscribe((result) => {
      if (result.success) {
        video.isLiked = false;
        video.likes -= 1;
      }
    });
  }

  challenge(video: any) {
    this.challengedVideoId = video._id;
  }

  submit() {

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
                                         alert("success");
                                },
                                (error) => alert("error"))
                  }(this.challengedVideoId, this._http, this.baseUrl),
                );
        }

      }
}
