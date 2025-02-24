import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tootlip-component',
  templateUrl: './tootlip-component.component.html',
  styleUrls: ['./tootlip-component.component.scss']
})
export class TootlipComponentComponent {
  @Input() tooltipText:string = '';

}
