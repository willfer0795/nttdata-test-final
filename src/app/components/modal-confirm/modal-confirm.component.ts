import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent {
  @Input() textModal: string = '';
  @Output() emitValue = new EventEmitter<boolean>();

  selectOption(option: boolean){
    this.emitValue.emit(option);
  }
}
