import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select'; // Importer MatSelectModule
import { MatOptionModule } from '@angular/material/core'; // Importer MatOptionModule

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, RouterModule, HttpClientModule, MatSelectModule, MatOptionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent {
  years: any[] = []; // Tableau pour stocker les années scolaires avec leurs classes
  filteredYears: any[] = []; // Tableau filtré pour afficher les années scolaires filtrées
  errorMessage: string | null = null;
  selectedYear: string | null = null; // Pour stocker l'année scolaire sélectionnée

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/classes') // Remplacez par l'URL de votre API
      .subscribe({
        next: (response) => {
          console.log('Classes reçues:', response);
          
          // Regrouper les classes par idSchool (qui représente l'année scolaire)
          const groupedByYear = this.groupClassesByYear(response);

          // Trier les années scolaires par ordre décroissant
          this.years = groupedByYear.sort((a, b) => parseInt(b.annee_scolaire) - parseInt(a.annee_scolaire));

          // Initialiser filteredYears avec toutes les années scolaires
          this.filteredYears = [...this.years];
          this.cdr.detectChanges(); // Forcer la détection des changements pour mettre à jour le DOM
        },
        error: (error) => {
          console.error('Erreur lors de l\'appel API:', error);
          this.errorMessage = 'Impossible de charger les données des années scolaires et des classes.';
        }
      });
  }

  // Fonction pour regrouper les classes par idSchool (année scolaire)
  groupClassesByYear(classes: any[]) {
    const grouped = classes.reduce((acc, classItem) => {
      const year = classItem.years_schools?.annee_scolaire || 'Année scolaire non définie';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(classItem);
      return acc;
    }, {});

    return Object.keys(grouped).map((year) => ({
      annee_scolaire: year,
      classes: grouped[year],
    }));
  }

  // Méthode pour filtrer les années scolaires en fonction de la sélection
  onYearChange() {
    if (this.selectedYear) {
      this.filteredYears = this.years.filter(year => year.annee_scolaire === this.selectedYear);
    } else {
      this.filteredYears = [...this.years]; // Réinitialiser si aucune année n'est sélectionnée
    }
  }
}
