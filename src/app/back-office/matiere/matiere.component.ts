import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Import du HttpClient pour faire des requêtes HTTP
import { CommonModule } from '@angular/common';  // Utiliser CommonModule au lieu de BrowserModule

@Component({
  selector: 'app-matiere',
  standalone: true,  // Marquer ce composant comme standalone
  templateUrl: './matiere.component.html',
  styleUrls: ['./matiere.component.css'],
  imports: [
    ReactiveFormsModule,  // Ajoute ReactiveFormsModule pour les formulaires réactifs
    CommonModule,         // Ajoute CommonModule pour les directives Angular comme ngIf, ngFor
    HttpClientModule      // Ajoute HttpClientModule pour effectuer des appels API
  ]
})
export class MatiereComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/matieres';  // L'URL de ton API pour ajouter une matière

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.matiereForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(225)]],
      idEdt: ['', Validators.required],
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
        console.log('Matière ajoutée avec succès', response);
        // Rediriger ou afficher un message de succès
      },
      error => {
        console.error('Erreur lors de l\'ajout de la matière', error);
        // Afficher un message d'erreur si la requête échoue
      }
    );
  }
}
