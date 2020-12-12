import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private firestore: AngularFirestore) { }

  agregarEmpleado(empleado: any):Promise<any> {
    return this.firestore.collection('empleados').add(empleado);
  }
}
