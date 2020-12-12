import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-create-empleado',
  templateUrl: './create-empleado.component.html',
  styleUrls: ['./create-empleado.component.css']
})
export class CreateEmpleadoComponent implements OnInit {

  createEmpleado: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  titulo = 'Agregar Empleado';
  
  constructor(private fb: FormBuilder, 
              private _empleadoService: EmpleadoService, 
              private router: Router, 
              private toastr: ToastrService,
              private activeRoute : ActivatedRoute) { 
    this.createEmpleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    })
    this.id = this.activeRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar()
  }

  agregarEditarEmpleado(){
    this.submitted = true;

    if(this.createEmpleado.invalid){
      return;
    }

    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }

  }

  agregarEmpleado(){
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }

    this.loading = true;

    this._empleadoService.agregarEmpleado(empleado).then(()=>{

      this.toastr.success('Empleado registrado exitosamente!!', 'registrado', {
        positionClass: 'toast-bottom-right'
      });

      this.loading = false;
      this.router.navigate(['/list-empleados']);

    }).catch(error => {

      this.loading = false;
      this.toastr.error('Disculpa Hubo un error!!', 'error', {
        positionClass: 'toast-mensajes de error al agregar -right'
      });
    });
  }

  editarEmpleado(id: string){
    
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }
    
    this.loading = true;
    this._empleadoService.actualizarEmpleado(id, empleado).then(()=>{
      this.loading = false;
      this.toastr.info('Empleado modificado con exito', 'Empleado actualizado', {
        positionClass: 'toast-bottom-right'
      });
      this.router.navigate(['/list-empleados']);
    });
  }

  esEditar(){
    this.titulo = 'Editar Empleado';
    if(this.id !== null){
      this.loading = true;

      this._empleadoService.getEmpleado(this.id).subscribe(data => {

        this.loading = false;
        
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        });
      });
    }
  }

}
