import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ChatService } from './chat.service';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';
//import * as io from "socket.io-client";

import localStorage from 'localStorage';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService],
})
export class ChatComponent implements OnInit{

  private baseUrl = environment.apiUrl;
  convs: any;
  //socket = io('http://localhost:8080');

  constructor(private chatService: ChatService, private el: ElementRef, private _http: Http) {}

  private userId = localStorage.getItem("userId");
  private friends = [];

  private error;
  private currentConv = null;
  private curentMessages = [];

  ngOnInit() {
    this.chatService.getConversations().subscribe((result) => { this.friends = result});
  }

  public async loadMessages(convId){
    this.currentConv = convId;
    await this.chatService.getChat(convId._id).subscribe((result) => { this.curentMessages = result.messages;});
  }

  postMessage(){
    let message = HTMLInputElement = this.el.nativeElement.querySelector('#message').value;
    if (message != null){
        const formData = {
        'message': message,
        'sendTo': (this.currentConv.participant1._id !== this.userId ? this.currentConv.participant1._id: this.currentConv.participant2._id)
      };
      console.log(formData)
      let headers = new Headers();
      headers.append('x-access-token', localStorage.getItem("token"));
      headers.append('Content-Type', 'application/json');
      this._http.post(this.baseUrl + "/chat/", JSON.stringify(formData), { headers: headers })
      .map((res) => res.json()).subscribe(
                                //map the success function and alert the response
                                 (success) => {
                                         window.location.reload();
                                },
                                (error) => {
                                  this.error = { message: 'L\'envois du message a échoué'};
                                  return;
                                })
    }

  }

  // sendMessage() {
  //   this.chatService.saveChat(this.msgData).then((result) => {
  //     this.socket.emit('save-message', result);
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  // logout() {
  //   var date = new Date();
  //   var user = JSON.parse(localStorage.getItem("user"));
  //   this.socket.emit('save-message', { room: user.room, nickname: user.nickname, message: 'Left this room', updated_at: date });
  //   localStorage.removeItem("user");
  //   this.joinned = false;
  // }
}