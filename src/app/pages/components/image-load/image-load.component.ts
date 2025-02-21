import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-load',
  templateUrl: './image-load.component.html',
  styleUrls: ['./image-load.component.scss']
})
export class ImageLoadComponent {
  @Input() src: string = '';
  isLoading: boolean = true;

  onLoad() {
    this.isLoading = false;
  }
}
