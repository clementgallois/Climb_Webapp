import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthGuard } from './_guards/index';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './profile/profile.service';
import { VideosService } from './videos/videos.service';
import { BattlesService } from './battles/battles.service';
import { SearchService } from './search/search.service';
import { RankingService } from './ranking/ranking.service';
import { ChatService } from './chat/chat.service';


import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AuthComponent } from './auth/auth.component';
import { SignUpComponent } from './signUp/signUp.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { VideosFeedComponent } from './videos/feed/videos.component';
import { BattlesFeedComponent } from './battles/feed/battles.component'
import { NewsListComponent } from './news/news-list.component';
import { SettingsComponent } from './settings/settings-page.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileVideosComponent } from './profile/videos/videos.component';
import { ProfileBattlesComponent } from './profile/battles/battles.component';
import { BookComponent } from './profile/book/book.component';
import { SettingsProfileComponent } from './settings/profile/profile.component';
import { UploadComponent } from './upload/upload.component';
import { VideoComponent } from './video/video.component';
import { SearchComponent } from './search/search.component';
import { RankingComponent } from './ranking/ranking.component';
import { ChatComponent } from './chat/chat.component';
import { ProfileOtherBattlesComponent } from './profileOther/battles/battles.component';
import { BookOtherComponent } from './profileOther/book/book.component';
import { ProfileOtherVideosComponent } from './profileOther/videos/videos.component';
import { ProfileOtherComponent } from './profileOther/profile.component';





@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignUpComponent,
    NavComponent,
    HomeComponent,
    VideosFeedComponent,
    BattlesFeedComponent,
    NewsListComponent,
    SettingsComponent,
    ProfileComponent,
    ProfileVideosComponent,
    ProfileBattlesComponent,
    BookComponent,
    SettingsProfileComponent,
    UploadComponent,
    SearchComponent,
    VideoComponent,
    RankingComponent,
    ChatComponent,
    ProfileOtherBattlesComponent,
    BookOtherComponent,
    ProfileOtherVideosComponent,
    ProfileOtherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AuthGuard,
    AuthService,
    ProfileService,
    VideosService,
    RankingService,
    BattlesService,
    SearchService,
    ChatService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
