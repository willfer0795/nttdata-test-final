import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormRegisterComponent } from './pages/components/form-register/form-register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageLoadComponent } from './pages/components/image-load/image-load.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


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
