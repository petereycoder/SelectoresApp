import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: UntypedFormGroup = this.fb.group({
    region: ['', Validators.required ],
    pais: ['', Validators.required ],
    frontera: ['', Validators.required ],
  })

  //llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor( private fb: UntypedFormBuilder,
               private paisesService: PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //Cuando cambie la región

    /*
    this.miFormulario.get('region')?.valueChanges
        .subscribe( region => {
          console.log(region);

          this.paisesService.getPaisesPorRegion(region)
              .subscribe( paises => {
                console.log(paises);
                this.paises = paises;
              })

        })
        */
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap( region => this.paisesService.getPaisesPorRegion(region) )
        )
        .subscribe( paises => {
          this.paises = paises;
          this.cargando = false;
        });

    //Cuando cambia el pais
    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap( () => {
            //this.fronteras = [];
            this.miFormulario.get('frontera')?.reset('');
            this.cargando = true;
          }),
          switchMap( codigo => this.paisesService.getPaisPorCodigo(codigo) ),
          switchMap( pais => this.paisesService.getPaisesPorCodigo(pais?.borders!) )
        )
        .subscribe( paises => {
          //this.fronteras = pais?.borders || [];
          this.fronteras = paises;
          this.cargando = false;
        })

  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
