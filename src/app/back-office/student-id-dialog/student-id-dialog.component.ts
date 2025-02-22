import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-student-id-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './student-id-dialog.component.html',
  styleUrls: ['./student-id-dialog.component.css']
})
export class StudentIdDialogComponent {
  classEStudent = {
    idCls: null as number | null
  };


  constructor(
    public dialogRef: MatDialogRef<StudentIdDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private http: HttpClient
  ) {}

  close(): void {
    this.dialogRef.close();
  }


  classeEtudiants: any[] = [];

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses(): void {
    this.http.get<any[]>('http://localhost:3000/api/classes') 
      .subscribe({
        next: (response) => {
          console.log('Classes récupérées :', response); 
          this.classeEtudiants = response; // Affecte les données
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des classes :', error);
        }
      });
  }


  onSubmit(form: NgForm): void {
    if (form.valid) {
      const payload = {
        idCls: this.classEStudent.idCls,
        idEdt: this.data.id
      };

      

      this.http.post('http://localhost:3000/api/class-e-students', payload)
        .subscribe({
          next: (response) => {
            console.log('Données envoyées avec succès :', response);
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erreur lors de l’envoi des données :', error);
          }
        });
    }
  }
}
