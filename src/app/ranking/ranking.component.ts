import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RankingService } from './ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements AfterViewInit {

  constructor(private _rankingService: RankingService){}

  private ranking = [];

  ngAfterViewInit() {
   	this._rankingService.getRankingLikes().subscribe((result) => {
     	if (result.success) {
       		this.ranking = result.likes;
      	}
      	else {
       	 alert('Videos feed failed');
      	}
    });
	}

}
