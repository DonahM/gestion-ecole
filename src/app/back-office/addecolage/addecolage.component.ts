import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-addecolage',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './addecolage.component.html',
  styleUrl: './addecolage.component.css'
})
export class AddecolageComponent {
  ecolageForm: FormGroup;
  studentId: number;
  statusOptions = ['Payer', 'Non Payer'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<AddecolageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number }
  ) {
    this.studentId = data.studentId;
    this.ecolageForm = this.fb.group({
      mois: ['', Validators.required],
      valeur: [0, [Validators.required, Validators.min(1)]],
      statut: ['Payer', Validators.required],
      date: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.ecolageForm.valid) {
      const newEcolage = { 
        ...this.ecolageForm.value,
        idEdt: this.studentId, 
        idSchool: 1 // Remplace cette valeur avec l'ID de l'école, si nécessaire.
      };

      this.http.post('http://localhost:3000/api/ecolages', newEcolage).subscribe({
        next: () => {
          this.dialogRef.close(true); // Ferme le pop-up et indique que l'ajout a réussi
        },
        error: () => {
          alert('Erreur lors de l\'ajout de l\'écolage');
        },
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Ferme le pop-up sans enregistrer
  }
}
