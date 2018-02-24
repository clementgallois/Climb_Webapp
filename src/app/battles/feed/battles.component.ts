import { Component } from '@angular/core';
import { BattlesService } from '../battles.service';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-battles',
  templateUrl: './battles.component.html',
  styleUrls: ['./battles.component.css']
})

 export class BattlesFeedComponent implements AfterViewInit {
   private error;
   private battles = [];
   constructor(private _battlesService: BattlesService) {}


  ngAfterViewInit() {
    this._battlesService.getFeedBattles().subscribe((result) => {
      if (result.success) {
        this.battles = result.battles;
      } else {
            this.error = { message: 'Le chargement du feed battle a échoué'};
      }
    });
  }

  vote(battle: any, vote: any) {
    this._battlesService.voteBattle(battle, vote).subscribe((result) => {
      if (result.success) {
        if (vote === 1) {
          if (battle.video_2.isVoted === true) {
            battle.video_2.votes > 0 ? battle.video_2.votes -= 1 : battle.video_2.votes = 0;
          }
          battle.video_1.isVoted = true;
          battle.video_2.isVoted = false;
          battle.video_1.votes += 1;
        } else if (vote === 2) {

          if (battle.video_1.isVoted === true) {
            battle.video_1.votes > 0 ? battle.video_1.votes -= 1 : battle.video_1.votes = 0;
          }
          battle.video_2.isVoted = true;
          battle.video_1.isVoted = false;

          battle.video_2.votes += 1;

        }
      } else {
            this.error = { message: 'Votre vote n\'a pas pu etre pris en compte'};
      }
    });
  }

  unvote(battle: any) {
    this._battlesService.unvoteBattle(battle).subscribe((result) => {
      if (result.success) {
        if (battle.video_1.isVoted === true) {
          battle.video_1.votes -= 1
        }
        if (battle.video_2.isVoted === true) {
          battle.video_2.votes -= 1
        }
        battle.video_1.isVoted = false;
        battle.video_2.isVoted = false;
      } else {
            this.error = { message: 'Votre vote n\'a pas pu etre pris en compte'};
      }
    });
  }
 }
