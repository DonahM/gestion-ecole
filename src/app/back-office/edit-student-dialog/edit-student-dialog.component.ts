import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface DialogData {
  field: string;
  value: any;
}

@Component({
  selector: 'app-edit-student-dialog',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './edit-student-dialog.component.html',
  styleUrls: ['./edit-student-dialog.component.css'],
})
export class EditStudentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  
  onNoClick(): void {
    if (this.data.value) {
      const confirmClose = confirm(
        'Voulez-vous vraiment annuler sans enregistrer ?'
      );
      if (!confirmClose) return;
    }
    this.dialogRef.close();
  }

  
  onSave(): void {
    this.dialogRef.close({ status: 'saved', value: this.data.value });
  }
}
