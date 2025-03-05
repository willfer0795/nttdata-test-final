import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private readonly datePipe: DatePipe) { }

  formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  formatDate(dateString: string, format: string): string {
      if (!dateString ) {
        return ''
      };
      const date = new Date(dateString+' 00:00:00');
  
      return this.datePipe.transform(date, format) ?? '';
    }
  
    convertDate(dateString: string): string {
      const [day, month, year] = dateString.split('/');
      const date = new Date(+year, +month - 1, +day);
      return this.datePipe.transform(date, 'yyyy-MM-dd') ?? '';
    }

    toggleDropdown(i:any) {
      let objTxt = document.getElementById(`drop_${i}`) as HTMLTextAreaElement;
      if (objTxt) {
        if (objTxt.classList.contains('show')) {
          objTxt.classList.remove('show')
        } else {
          objTxt.classList.add('show')
        }
      }
    }

    openModal(id:string) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.style.display = 'block';
      }
    }
    
     closeModal(id:string) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.style.display = 'none';
      }
    }

    parseDate(dateString: string): Date {
      return new Date(dateString + 'T00:00:00');
    }
    
    removeTime(date: Date): Date {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    includesText(text: string | undefined, searchValue: string): boolean {
      return text?.toLowerCase().includes(searchValue) ?? false;
    }

}
