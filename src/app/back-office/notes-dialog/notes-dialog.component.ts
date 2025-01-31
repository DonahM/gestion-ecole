
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-notes-dialog',
  imports: [MatTableModule, CommonModule],
  templateUrl: './notes-dialog.component.html',
  styleUrl: './notes-dialog.component.css'
})

export class NotesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
