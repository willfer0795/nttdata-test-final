import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})
export class CrearProductoComponent implements OnInit {
  formulario:any;
  fechaLiberacionTmp :any;
  constructor(
    private router:Router
  ) {

  }

  ngOnInit() {
    
  }

  return = () =>{
    this.router.navigateByUrl("productos/listar-productos")
  }

}

