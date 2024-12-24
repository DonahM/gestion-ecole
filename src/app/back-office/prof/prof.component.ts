import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-prof',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './prof.component.html',
  styleUrl: './prof.component.css',
})
export class ProfComponent implements OnInit {
  displayedColumns: string[] = ['matricule', 'nom', 'prenom', 'matiere', 'actions'];
  dataSource: MatTableDataSource<Prof> = new MatTableDataSource<Prof>([]);
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchProfesseurs();
  }

  fetchProfesseurs() {
    this.http.get<Prof[]>('http://localhost:3000/api/professeurs').subscribe({
      next: (response) => {
        this.dataSource.data = this.mapData(response);
      },
      error: (error) => {
        console.error('Erreur lors de l\'appel API:', error);
        this.errorMessage = 'Impossible de charger les professeurs.';
      },
    });
  }

  mapData(data: any[]): Prof[] {
    return data.map((prof) => ({
      matricule: prof.idProf,
      nom: prof.name,
      prenom: prof.surname,
      matiere: prof.matiere,
    }));
  }

  viewDetails(matricule: number) {
    this.router.navigate(['/back-office/prof/profile', matricule]);
  }
}

export interface Prof {
  matricule: number;
  nom: string;
  prenom: string;
  matiere: string;
}
