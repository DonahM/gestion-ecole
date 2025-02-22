import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StudentIdDialogComponent } from '../student-id-dialog/student-id-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-student-id-e-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './student-id-e-dialog.component.html',
  styleUrl: './student-id-e-dialog.component.css'
})
export class StudentIdEDialogComponent {
   yersStudent = {
    idSchool: null as number | null
  };

  anneesScolaires: Array<{ idSchool: number; annee_scolaire: string }> = []; // Récupère depuis l'API

  constructor(
    public dialogRef: MatDialogRef<StudentIdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number,name: string },
    private http: HttpClient
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getAnneesScolaires();
  }

  getAnneesScolaires(): void {
    this.http.get<{ data: any[], total: number }>('http://localhost:3000/api/years-school')
      .subscribe({
        next: (response) => {
          console.log('Données récupérées :', response);
          this.anneesScolaires = response.data; // 👈 Utilise directement le tableau
        },
        error: (error) => {
          console.error("Erreur lors de la récupération des années scolaires :", error);
        }
      });
  }
  

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const payload = {
        idSchool: this.yersStudent.idSchool,
        idEdt: this.data.id
      };

      this.http.post('http://localhost:3000/api/students-years', payload)
        .subscribe({
          next: (response: any) => {
            console.log('Données envoyées avec succès :', response);
            this.dialogRef.close(response);
          },
          error: (error: any) => {
            console.error('Erreur lors de l’envoi des données :', error);
          }
        });
    }
  }
}
