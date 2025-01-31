import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, RouterModule, HttpClientModule, MatSelectModule, MatOptionModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent {
  years: any[] = [];
  filteredYears: any[] = [];
  errorMessage: string | null = null;
  selectedYear: string | null = null;
  router: any;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      alert('Utilisateur non connecté. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    const userId = JSON.parse(userData).idUser;

    this.http.get<any[]>('http://localhost:3000/api/classes')
      .subscribe({
        next: (response) => {
          console.log('Classes reçues:', response);

          const filteredClasses = response.filter(classItem => classItem.idUser === userId);
          const groupedByYear = this.groupClassesByYear(filteredClasses);

          this.years = groupedByYear.sort((a, b) => parseInt(b.annee_scolaire) - parseInt(a.annee_scolaire));
          this.filteredYears = [...this.years];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur lors de l\'appel API:', error);
          this.errorMessage = 'Impossible de charger les données des années scolaires et des classes.';
        }
      });
  }
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

  onYearChange() {
    if (this.selectedYear) {
      this.filteredYears = this.years.filter(year => year.annee_scolaire === this.selectedYear);
    } else {
      this.filteredYears = [...this.years];
    }
  }
}
