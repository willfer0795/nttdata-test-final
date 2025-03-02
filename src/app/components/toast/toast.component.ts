import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent  implements OnInit {
  @Input() auto:boolean = true;
  @Input() timeClose:number = 3000;
  messages: { text: string, type: string }[] = [];

  constructor() {}

  ngOnInit(): void {}

  showToast(message: string, type: string = 'info') {
    this.messages.push({ text: message, type: type });
    if (this.auto) {
      setTimeout(() => {
        this.closeMessage();
      }, this.timeClose);
    }
    
  }
  closeMessage(){
    this.messages.shift();
  }
}
