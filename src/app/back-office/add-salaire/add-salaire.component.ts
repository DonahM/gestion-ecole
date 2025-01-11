import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-salaire',
  templateUrl: './add-salaire.component.html',
  styleUrl: './add-salaire.component.css',
  imports: [
    ReactiveFormsModule,  // Ajoute ReactiveFormsModule pour les formulaires réactifs
    CommonModule,         // Ajoute CommonModule pour les directives Angular comme ngIf, ngFor
    HttpClientModule      // Ajoute HttpClientModule pour effectuer des appels API
  ]
})
export class AddSalaireComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/salaires';  // L'URL de ton API pour ajouter une matière

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.matiereForm = this.fb.group({
      mois: ['', [Validators.required, Validators.maxLength(225)]],
      statut: ['', [Validators.required, Validators.maxLength(225)]],
      valeur: ['', [Validators.required, Validators.maxLength(225)]],
      date: ['', [Validators.required, Validators.maxLength(225)]],
      idProf: ['', Validators.required],
      idSchool: ['', Validators.required]
    });
  }

  months: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  

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
        console.log('salaire ajoutée avec succès', response);
        // Rediriger ou afficher un message de succès
      },
      error => {
        console.error('Erreur lors de l\'ajout de la salaire', error);
        // Afficher un message d'erreur si la requête échoue
      }
    );
  }
}
