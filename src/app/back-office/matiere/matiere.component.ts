import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; 
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-matiere',
  standalone: true, 
  templateUrl: './matiere.component.html',
  styleUrls: ['./matiere.component.css'],
  imports: [
    ReactiveFormsModule,  
    CommonModule,         
    HttpClientModule      
  ]
})
export class MatiereComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/matieres';  

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.matiereForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(225)]],
      // idEdt: ['', Validators.required],
      idSchool: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.matiereForm.valid) {
      const matiereData = this.matiereForm.value;
      this.addMatiere(matiereData);
    } else {
      console.log('Le formulaire est invalide');
    }
  }
  addMatiere(matiereData: any) {
    this.http.post(this.apiUrl, matiereData).subscribe(
      response => {
        console.log('Matière ajoutée avec succès', response);
      },
      error => {
        console.error('Erreur lors de l\'ajout de la matière', error);
      }
    );
  }
}
