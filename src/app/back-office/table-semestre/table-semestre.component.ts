import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-semestre',
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
  templateUrl: './table-semestre.component.html',
  styleUrl: './table-semestre.component.css',
})
export class TableSemestreComponent implements OnInit {
  displayedColumns: string[] = ['name', 'idSchool', 'actions'];
  dataSource: MatTableDataSource<Semestre> = new MatTableDataSource<Semestre>([]);
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadSemesters();
  }

  loadSemesters(): void {
    const apiUrl = 'http://localhost:3000/api/semestres';
    this.http.get<Semestre[]>(apiUrl).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des semestres:', error);
        this.errorMessage = 'Impossible de charger les semestres.';
      },
    });
  }

  // deleteElement(idSem: number): void {
  //   this.dataSource.data = this.dataSource.data.filter((semester) => semester.idSem !== idSem);
  // }

  deleteElement(idSem: number): void {
    const apiUrl = `http://localhost:3000/api/semestres/${idSem}`;
    this.http.delete(apiUrl).subscribe({
      next: () => {
        // Supprimer l'élément du tableau local après la suppression réussie sur le serveur
        this.dataSource.data = this.dataSource.data.filter((semester) => semester.idSem !== idSem);
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du semestre:', error);
        this.errorMessage = 'Impossible de supprimer le semestre.';
      },
    });
  }

}

export interface Semestre {
  idSem: number;
  name: string;
  idSchool: number;
}
