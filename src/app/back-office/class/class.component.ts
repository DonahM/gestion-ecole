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
        next: (classes) => {
          console.log('Classes reçues:', classes);
  
          const filteredClasses = classes.filter(classItem => classItem.idUser === userId);
  
          this.http.get<any>('http://localhost:3000/api/years-school')
  .subscribe({
    next: (response) => {
      console.log('Réponse API écoles:', response);

      const schools = response?.data || [];

      console.log('Écoles après extraction:', schools);

      this.years = this.groupClassesByYear(filteredClasses, schools);
      this.filteredYears = [...this.years];
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Erreur lors de la récupération des écoles:', error);
      this.errorMessage = 'Impossible de charger les années scolaires.';
    }
  });

        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes:', error);
          this.errorMessage = 'Impossible de charger les classes.';
        }
      });
  }
  
  
  groupClassesByYear(classes: any[], schools: any[]) {
    const schoolMap = schools.reduce((acc, school) => {
      acc[school.idSchool] = school.annee_scolaire;  
      return acc;
    }, {} as Record<number, string>);
  
    console.log('Mapping des écoles:', schoolMap);
  
    const grouped = classes.reduce((acc, classItem) => {
      const idSchool = classItem.years_schools?.[0]?.idSchool;
      const year = schoolMap[idSchool] || 'Année scolaire non définie';
  
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(classItem);
      return acc;
    }, {} as Record<string, any[]>);
  
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
