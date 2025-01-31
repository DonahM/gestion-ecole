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
  styleUrl: './table-salaire.component.css',
})
export class TableSalaireComponent implements OnInit {
  displayedColumns: string[] = [ 'idProf','mois', 'valeur', 'idSchool', 'date', 'statut', 'actions'];
  dataSource: MatTableDataSource<Salaire> = new MatTableDataSource<Salaire>([]);
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadSalaries();
  }

  loadSalaries(): void {
    const apiUrl = 'http://localhost:3000/api/salaires';
    this.http.get<Salaire[]>(apiUrl).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des salaires:', error);
        this.errorMessage = 'Impossible de charger les salaires.';
      },
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
}
