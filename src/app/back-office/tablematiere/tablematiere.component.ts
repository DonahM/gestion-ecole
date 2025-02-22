import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tablematiere',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    HttpClientModule,RouterModule,  ],
  templateUrl: './tablematiere.component.html',
  styleUrls: ['./tablematiere.component.css']
})
export class TablematiereComponent implements OnInit {
  displayedColumns: string[] = ['name','idSchool', 'actions'];
  dataSource: MatTableDataSource<Matiere> = new MatTableDataSource<Matiere>([]);
  errorMessage: string | null = null;
  apiUrl: string = 'http://localhost:3000/api/matieres'; 

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadMatieres();
  }

  loadMatieres(): void {
    this.http.get<Matiere[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des matières:', error);
        this.errorMessage = 'Impossible de charger les matières.';
      }
    });
  }

  addElement() {
    const newElement: Matiere = {
      idMat: this.dataSource.data.length + 1,
      name: 'Nouvelle Matière',
      idEdt: 0,
      idSchool: 0,
      etudiants: [],
      notes: []
    };

    this.dataSource.data = [...this.dataSource.data, newElement];
    this.updatePaginator();
  }

  deleteElement(idMat: number) {
    this.dataSource.data = this.dataSource.data.filter((matiere) => matiere.idMat !== idMat);
    this.updatePaginator();
  }

  private updatePaginator() {
    if (this.paginator) {
      this.paginator.length = this.dataSource.data.length;
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
    }
  }
}

export interface Matiere {
  idMat: number;
  name: string;
  idEdt: number;
  idSchool: number;
  etudiants: any[];
  notes: any[];
}
