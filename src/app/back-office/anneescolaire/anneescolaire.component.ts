import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Year {
  annee_scolaire: string; // ou le type approprié pour la propriété annee_scolaire
}

@Component({
  selector: 'app-anneescolaire',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './anneescolaire.component.html',
  styleUrls: ['./anneescolaire.component.css'],
})
export class AnneescolaireComponent implements OnInit {
  form: FormGroup;
  existingYears: string[] = [];
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AnneescolaireComponent>
  ) {
    this.form = this.fb.group({
      annee_scolaire: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit(): void {
    this.loadExistingYears();
  }

  loadExistingYears(): void {
    this.http.get<Year[]>('http://localhost:3000/api/years-school').subscribe({
      next: (data) => {
        this.existingYears = data.map((year) => year.annee_scolaire); // Assurez-vous que 'annee_scolaire' existe dans 'year'
      },
      error: (error) => {
        console.error('Erreur lors du chargement des années scolaires :', error);
        this.errorMessage = 'Erreur lors du chargement des années scolaires existantes.';
      },
    });
  }

  addYear(): void {
    const newYear = this.form.value.annee_scolaire;

    // Vérifier si l'année scolaire existe déjà
    if (this.existingYears.includes(newYear)) {
      this.errorMessage = 'Cette année scolaire existe déjà.';
      return;
    }

    this.errorMessage = null;

    this.http.post('http://localhost:3000/api/years-school', { annee_scolaire: newYear }).subscribe({
      next: () => {
        alert('Année scolaire ajoutée avec succès.');
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout de l\'année scolaire :', error);
        this.errorMessage = 'Erreur lors de l’ajout de l’année scolaire.';
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
