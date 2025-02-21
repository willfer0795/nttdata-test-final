import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormRegisterComponent } from './pages/components/form-register/form-register.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FormRegisterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
  ],
  providers: [DatePipe],
  exports: [FormRegisterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
})
export class SharedModule { }
