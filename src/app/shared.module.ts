import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { ImageLoadComponent } from './components/image-load/image-load.component';
import { TootlipComponentComponent } from './components/tootlip-component/tootlip-component.component';
import { SkeletonListComponent } from './components/skeleton-list/skeleton-list.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { ToastComponent } from './components/toast/toast.component';

@NgModule({
  declarations: [
    FormRegisterComponent,
    ImageLoadComponent,
    TootlipComponentComponent,
    SkeletonListComponent,
    ModalConfirmComponent,
    ToastComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    NgxSkeletonLoaderModule, 
  ],
  providers: [DatePipe],
  exports: [FormRegisterComponent,
            ImageLoadComponent, 
            TootlipComponentComponent,
            SkeletonListComponent,
            ModalConfirmComponent,
            ToastComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class SharedModule { }
