import { EmpleadoService } from './../../services/empleado.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  texto = 'Agregar Registro';

  constructor(private fb: FormBuilder,
              private _empleado: EmpleadoService,
              private router: Router,
              private toastr: ToastrService,
              private aRoute: ActivatedRoute
  ) {
    this.createEmpleado = fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    });
    this.id = this.aRoute.snapshot.paramMap.get('id');
    // console.log(this.id);
   }

  ngOnInit(): void {
    this.editar()
  }

  agregarEditarEmpleado(){
    this.submitted = true;
    if (this.createEmpleado.invalid) {
      return
    }

    if (this.id === null) {
      this.agregarEmpleado();
    } else {
      this.editarEmpleado(this.id);
    }

  }

  agregarEmpleado() {
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    //console.log(empleado);
    this.loading = true;
    this._empleado.agregarEmpleado(empleado).then( () => {
      this.toastr.success('Empleado Registrado', 'El empleado fue registrado', { positionClass: 'toast-bottom-right'});
      this.loading = false;
      this.router.navigate(['/list-empleados']);
    }).catch( error => {
      console.log(error)
      this.loading = false;
    })
  }

  editarEmpleado(id: string) {
    this.loading = true;
    const empleado: any = {
      nombre: this.createEmpleado.value.nombre,
      apellido: this.createEmpleado.value.apellido,
      documento: this.createEmpleado.value.documento,
      salario: this.createEmpleado.value.salario,
      fechaActualizacion: new Date()
    }
    this._empleado.actualizarEmpleado(id, empleado).then(() => {
      this.loading = false;
      this.toastr.info('Campo modificado', 'El registro se modifico correctamente', { positionClass: 'toast-bottom-right'});
      this.router.navigate(['/list-empleados']);
    })
  }

  editar(){
    if (this.id != null) {
      this.loading = true;
      this.texto = 'Editar Registro';

      this._empleado.getEmpleado(this.id).subscribe(data => {
        // console.log(data.payload.data()['nombre']);
        this.loading = false;
        this.createEmpleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario']
        })
      })
    }
  }
}
