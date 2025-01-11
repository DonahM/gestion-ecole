import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrl: './add-note.component.css',
  imports: [
    ReactiveFormsModule,  // Ajoute ReactiveFormsModule pour les formulaires réactifs
    CommonModule,         // Ajoute CommonModule pour les directives Angular comme ngIf, ngFor
    HttpClientModule      // Ajoute HttpClientModule pour effectuer des appels API
  ]
})
export class AddNoteComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/notes';  // L'URL de ton API pour ajouter une matière

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.matiereForm = this.fb.group({
      note: ['', [Validators.required, Validators.maxLength(225)]],
      coefficient: ['', [Validators.required, Validators.maxLength(225)]],
      idEdt: ['', Validators.required],
      idMat: ['', Validators.required],
      idSem: ['', Validators.required],
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

  // Fonction pour envoyer les données vers l'API
  addMatiere(matiereData: any) {
    this.http.post(this.apiUrl, matiereData).subscribe(
      response => {
        console.log('note ajoutée avec succès', response);
        // Rediriger ou afficher un message de succès
      },
      error => {
        console.error('Erreur lors de l\'ajout de la note', error);
        // Afficher un message d'erreur si la requête échoue
      }
    );
  }
}
