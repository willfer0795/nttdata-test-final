import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormRegisterComponent } from './components/form-register/form-register.component';
import { ImageLoadComponent } from './components/image-load/image-load.component';


@NgModule({
  declarations: [
    FormRegisterComponent,
    ImageLoadComponent
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
  exports: [FormRegisterComponent,ImageLoadComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class SharedModule { }
