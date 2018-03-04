import { Component, AfterViewInit, OnInit, OnChanges, Input, ViewChild, SimpleChanges, SimpleChange } from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';

const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;

@Component({
  selector: 'app-thumbnail-selector',
  templateUrl: './thumbnail-selector.component.html',
  styleUrls: ['./thumbnail-selector.component.css']
})
export class ThumbnailSelectorComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('videoplayer') videoplayer: any;
  @ViewChild('canvas') canvas: any;

  @Input() video: File;

  private tempUrl: any;
  private context: CanvasRenderingContext2D;
  private element: HTMLVideoElement;
  private time: number;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.time = 100;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.tempUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.video));
    }

    ngAfterViewInit() {
      this.context = this.canvas.nativeElement.getContext('2d');
      this.element = this.videoplayer.nativeElement;

      this.element.addEventListener('seeked', this.redrawImage.bind(this), false);
      this.element.addEventListener('loadeddata', this.videoChange.bind(this), false);
    }

    videoChange() {
      this.time = 100
      this.videoplayer.nativeElement.currentTime = this.videoplayer.nativeElement.duration * (this.time / 1000);
      this.redrawImage.bind(this)()
    }
    redrawImage() {
        this.context.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        this.context.drawImage(this.element, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    }
    seekbar(value) {
      console.log(this.time)
      this.time = value;
      const time = this.videoplayer.nativeElement.duration * (this.time / 1000);
      this.videoplayer.nativeElement.currentTime = time
    }
}
