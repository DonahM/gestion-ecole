import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface Matiere {
  idMat: number;
  name: string;
  idEdt: number;
  idSchool: number;
}

interface Note {
  idNot: number;
  note: number;
  coefficient: number;
  idEdt: number;
  idMat: number;
  idSchool: number;
  idSem: number;
  matieres: Matiere;
}

interface Etudiant {
  idEdt: number;
  name: string;
  surname: string;
  notes: Note[];
}

@Component({
  selector: 'app-student-notes-dialog',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './student-notes-dialog.component.html',
  styleUrls: ['./student-notes-dialog.component.css']
})
export class StudentNotesDialogComponent  {
  constructor(@Inject(MAT_DIALOG_DATA) public student: any) {}
  get totalCoefficients(): number {
    return this.student.notes.reduce((sum: number, note: Note) => sum + note.coefficient, 0);
  }
  
  get moyennePonderee(): number {
    const totalNotes = this.student.notes.reduce((sum: number, note: Note) => sum + (note.note * note.coefficient), 0);
    return this.totalCoefficients > 0 ? totalNotes / this.totalCoefficients : 0;
  }
  
  get moyenneSimple(): number {
    if (this.student.notes.length === 0) return 0;
    const totalNotes = this.student.notes.reduce((sum: number, note: Note) => sum + note.note, 0);
    return totalNotes / this.student.notes.length;
  }
  
}
