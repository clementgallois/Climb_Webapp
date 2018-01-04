import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-book',
  templateUrl: './book.component.html'
})

export class BookOtherComponent {

  constructor(private _service: ProfileService){}

}
