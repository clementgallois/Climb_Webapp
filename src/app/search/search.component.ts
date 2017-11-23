import { Component, AfterViewInit} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { SearchService } from './search.service';


declare var jQuery:any;

@Component({
  selector : 'app-search',
  templateUrl: './search.component.html',
  providers: [SearchService],
})

export class SearchComponent {
  private baseUrl = environment.apiUrl;
  private users = [];

  constructor(private _activateRoute: ActivatedRoute, private _searchService: SearchService, private router: Router){
    this._activateRoute.params.subscribe(
          (param: any) => {
            this._searchService.search(param.value).subscribe((search) => {
              this.users = search.users;
            });
    });
  }

}
