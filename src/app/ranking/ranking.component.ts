import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RankingService } from './ranking.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements AfterViewInit {

    private ranking = [{username: 'perceles', count: 4}];
  constructor(private _rankingService: RankingService) {}


  ngAfterViewInit() {
     this._rankingService.getRankingLikes().subscribe((result) => {
       if (result.success) {
           this.ranking = result.likes;
        } else {
          alert(result);
        }
    });
  }

}
