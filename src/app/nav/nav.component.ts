import { Router, ActivatedRoute } from '@angular/router';
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
declare var $:any;

@Component({
  selector : 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  constructor(private _router: Router, private _http: Http, private router: Router,  private el: ElementRef){
  }

  search(event) {
    this._router.navigate(['/search', {value: event.target.value}])

  }

}
