import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap';

import { AuthGuard } from './_guards/auth.guard';
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
import { BattlesFeedComponent } from './battles/feed/battles.component';
import { SettingsComponent } from './settings/settings-page.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsProfileComponent } from './settings/profile/profile.component';
import { UploadComponent } from './upload/upload.component';
import { VideoComponent } from './video/video.component';
import { SearchComponent } from './search/search.component';
import { RankingComponent } from './ranking/ranking.component';
import { ChatComponent } from './chat/chat.component';
import { ThumbnailSelectorComponent } from './thumbnail-selector/thumbnail-selector.component';





@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignUpComponent,
    NavComponent,
    HomeComponent,
    VideosFeedComponent,
    BattlesFeedComponent,
    SettingsComponent,
    ProfileComponent,
    SettingsProfileComponent,
    UploadComponent,
    SearchComponent,
    VideoComponent,
    RankingComponent,
    ChatComponent,
    ThumbnailSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ModalModule.forRoot()
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
