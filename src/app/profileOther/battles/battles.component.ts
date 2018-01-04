import { Component } from '@angular/core';
import { BattlesService } from './battles.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'profile-battles',
  templateUrl: './battles.component.html',
  styleUrls: ['./battles.component.css'],
  providers: [BattlesService],
})

 export class ProfileOtherBattlesComponent {
   constructor(private _battlesService: BattlesService, private route: ActivatedRoute){}

  private battles = [];
  private user;

  ngAfterViewInit() {
    this.route.parent.url.subscribe((urlPath) => this.user = urlPath[1].path)
    this._battlesService.getProfileBattles(this.user).subscribe((result) => {
      if (result.success) {
        console.log(result)
        this.battles = result.battles;
      } else {
        alert('battles feed failed');
      }
    });
  }

  vote(battle: any, vote: any) {
    this._battlesService.voteBattle(battle, vote).subscribe((result) => {
      if (result.success) {
      	if (vote == 1){
      		if (battle.video_2.isVoted == true){
      			battle.video_2.votes > 0 ? battle.video_2.votes -= 1 : battle.video_2.votes = 0;
      		}
      		battle.video_1.isVoted = true;
      		battle.video_2.isVoted = false;
      		battle.video_1.votes += 1;
      	}
      	else if (vote == 2)
      	{

      		if (battle.video_1.isVoted == true){
      			battle.video_1.votes > 0 ? battle.video_1.votes -= 1 : battle.video_1.votes = 0;
      		}
      		battle.video_2.isVoted = true;
      		battle.video_1.isVoted = false;

      		battle.video_2.votes += 1;

      	}
      } else {
        alert('battle like failed');
      }
    });
  }

  unvote(battle: any) {
    this._battlesService.unvoteBattle(battle).subscribe((result) => {
      if (result.success) {
      	if (battle.video_1.isVoted == true) {
      		battle.video_1.votes -= 1
      	}
      	if (battle.video_2.isVoted == true) {
      		battle.video_2.votes -= 1
      	}
      	battle.video_1.isVoted = false;
      	battle.video_2.isVoted = false;
      } else {
        alert('battle unlike failed');
      }
    });
  }
 }
