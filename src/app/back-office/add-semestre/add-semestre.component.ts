import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-semestre',
  templateUrl: './add-semestre.component.html',
  styleUrl: './add-semestre.component.css',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule
  ]
})
export class AddSemestreComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/semestres';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.matiereForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(225)]],
      idSchool: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.matiereForm.valid) {
      const matiereData = this.matiereForm.value;
      this.AddSemestre(matiereData);
    } else {
      console.log('Le formulaire est invalide');
    }
  }
  AddSemestre(matiereData: any) {
    this.http.post(this.apiUrl, matiereData).subscribe(
      response => {
        console.log('semestre ajoutée avec succès', response);
      },
      error => {
        console.error('Erreur lors de l\'ajout de la semestre', error);
      }
    );
  }
  
}
