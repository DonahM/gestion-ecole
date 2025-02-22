import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-salaire',
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
  templateUrl: './table-salaire.component.html',
  styleUrls: ['./table-salaire.component.css'],
})
export class TableSalaireComponent implements OnInit {
  displayedColumns: string[] = ['profName', 'mois', 'valeur', 'annee_scolaire', 'date', 'statut', 'actions'];
  dataSource: MatTableDataSource<Salaire> = new MatTableDataSource<Salaire>([]);
  errorMessage: string | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  professeur: any[] = [];
  anneesScolaires: Array<{ idSchool: number; annee_scolaire: string }> = [];
  salaireData: any[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.getProfesseur();
    this.getAnneesScolaires();
  }
  getProfesseur(): void {
    this.http.get<any[]>('http://localhost:3000/api/professeurs').subscribe({
      next: (professeurs) => {
        this.professeur = professeurs;
        this.getSalaire(); 
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des professeurs :', error);
      }
    });
  }

  /** 🔹 Récupère les années scolaires */
  getAnneesScolaires(): void {
    this.http.get<{ data: any[], total: number }>('http://localhost:3000/api/years-school')
      .subscribe({
        next: (response) => {
          console.log('Années scolaires récupérées :', response);
          this.anneesScolaires = response.data;
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des années scolaires :", error);
        }
      });
  }

  /** 🔹 Récupère les salaires et associe les professeurs et années scolaires */
  getSalaire(): void {
    this.http.get<any[]>('http://localhost:3000/api/salaires').subscribe({
      next: (salaires) => {
        this.salaireData = salaires.map((salaire) => {
          const prof = this.professeur.find(p => p.idProf === salaire.idProf);
          const profName = prof ? `${prof.name} ${prof.surname}` : 'Inconnu';
          
          const annee = this.anneesScolaires.find(a => a.idSchool === salaire.idSchool);
          const anneeScolaire = annee ? annee.annee_scolaire : 'Inconnue';
          
          return {
            ...salaire,
            profName,
            annee_scolaire: anneeScolaire
          };
        });

        this.dataSource.data = this.salaireData; 
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des salaires :', error);
      }
    });
  }

  deleteElement(idSal: number): void {
    this.dataSource.data = this.dataSource.data.filter((salaire) => salaire.idSal !== idSal);
  }
}

export interface Salaire {
  idSal: number;
  mois: string;
  statut: string;
  valeur: number;
  date: string;
  idProf: number;
  idSchool: number;
  profName?: string;
  annee_scolaire?: string;
}
