import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge-dialog',
  templateUrl: './badge-dialog.component.html',
  styleUrls: ['./badge-dialog.component.css'],
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
})
export class BadgeDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public student: any) {}

  exportToPDF(): void {
    const doc = new jsPDF();
    const content = document.getElementById('student-info');

    if (content) {
      doc.html(content, {
        callback: function (doc) {
          doc.save('student_info.pdf');
        },
        margin: [10, 10, 10, 10],
      });
    }
  }

  exportToJPG(): void {
    const content = document.getElementById('student-info');

    if (content) {
      html2canvas(content).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'student_info.jpg';
        link.click();
      });
    }
  }
}
