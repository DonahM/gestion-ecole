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
  selector: 'app-table-note',
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
  templateUrl: './table-note.component.html',
  styleUrl: './table-note.component.css',
})
export class TableNoteComponent implements OnInit {
  displayedColumns: string[] = ['note', 'coefficient', 'idEdt', 'idMat', 'idSchool', 'idSem', 'actions'];
  dataSource: MatTableDataSource<Note> = new MatTableDataSource<Note>([]);
  errorMessage: string | null = null;

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadNotes();
  }

  loadNotes(): void {
    const apiUrl = 'http://localhost:3000/api/notes'; // Adjust your API endpoint
    this.http.get<Note[]>(apiUrl).subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des notes:', error);
        this.errorMessage = 'Impossible de charger les notes.';
      },
    });
  }

  deleteElement(idNot: number): void {
    this.dataSource.data = this.dataSource.data.filter((note) => note.idNot !== idNot);
  }
}

export interface Note {
  idNot: number;
  note: number;
  coefficient: number;
  idEdt: number;
  idMat: number;
  idSchool: number;
  idSem: number;
}
