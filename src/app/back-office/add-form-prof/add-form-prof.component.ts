import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-form-prof',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule,HttpClientModule],
  templateUrl: './add-form-prof.component.html',
  styleUrl: './add-form-prof.component.css'
})
export class AddFormProfComponent implements OnInit {
  errorMessage: string | null = null;
  yearsSchools: Array<{ idSchool: number; annee_scolaire: string }> = [];

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {
    this.loadYearsSchools();
  }

  loadYearsSchools(): void {
    this.http.get<{ data: { idSchool: number; annee_scolaire: string }[] }>('http://localhost:3000/api/years-school').subscribe({
      next: (response) => {
        console.log('Données reçues pour yearsSchools:', response);
        this.yearsSchools = response.data;  // Assurez-vous que vous utilisez la propriété 'data'
      },
      error: (error) => console.error('Erreur lors du chargement des années scolaires:', error),
    });
  }
  
  

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    const newProf = {
      name: form.value.name,
      surname: form.value.surname,
      matiere: form.value.matiere,
      idSchool: form.value.anneeScolaire,     
    };

    // Envoi des données à l'API
    this.http.post('http://localhost:3000/api/professeurs', newProf).subscribe({
      next: () => {
        console.log('Professeur ajouté avec succès');
        this.router.navigate(['/back-office/prof']); // Retour à la liste
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du professeur:', error);
        this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }

  onCancel() {
    this.router.navigate(['/back-office/prof']); // Redirige vers la liste
  }
}
