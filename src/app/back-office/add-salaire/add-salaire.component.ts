import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {  FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-salaire',
  templateUrl: './add-salaire.component.html',
  styleUrl: './add-salaire.component.css',
  imports: [
    ReactiveFormsModule,  // Ajoute ReactiveFormsModule pour les formulaires réactifs
    CommonModule,         // Ajoute CommonModule pour les directives Angular comme ngIf, ngFor
    HttpClientModule,   // Ajoute HttpClientModule pour effectuer des appels API
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class AddSalaireComponent {
  matiereForm: FormGroup;
  apiUrl = 'http://localhost:3000/api/salaires';
  anneesScolaires: Array<{ idSchool: number; annee_scolaire: string }> = []; // Récupère depuis l'API
  professeur: any[] = [];

  yersStudent = {
    idSchool: null as number | null
  };

  form = new FormGroup({
    idCls: new FormControl(null, [Validators.required]),
  })
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

  ngOnInit(): void {
    this.getAnneesScolaires();
    this.getProfesseur();
  }

  getAnneesScolaires(): void {
    this.http.get<{ data: any[], total: number }>('http://localhost:3000/api/years-school')
      .subscribe({
        next: (response) => {
          console.log('Données récupérées :', response);
          this.anneesScolaires = response.data; // 👈 Utilise directement le tableau
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des années scolaires :", error);
        }
      });
  }

  getProfesseur(): void {
    this.http.get<any[]>('http://localhost:3000/api/professeurs') 
      .subscribe({
        next: (response) => {
          console.log('prof récupérées :', response); 
          this.professeur = response; // Affecte les données
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des prof :', error);
        }
      });
  }

  // Fonction pour envoyer les données vers l'API
  addMatiere(matiereData: any) {
    this.http.post(this.apiUrl, matiereData).subscribe(
      response => {
        console.log('salaire ajoutée avec succès', response);
      },
      error => {
        console.error('Erreur lors de l\'ajout de la salaire', error);
      }
    );
  }
}
