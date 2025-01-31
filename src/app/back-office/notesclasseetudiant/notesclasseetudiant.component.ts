import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClasseService } from '../../services/classe.service';
import { Etudiant } from '../../models/etudiant.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Matiere } from '../../models/matiere.model';

@Component({
  selector: 'app-notesclasseetudiant',
  imports: [HttpClientModule, CommonModule],
  providers: [ClasseService],
  templateUrl: './notesclasseetudiant.component.html',
  styleUrls: ['./notesclasseetudiant.component.css']
})
export class NotesclasseetudiantComponent implements OnInit {
  idCls: string | null = null;
  students: Etudiant[] = [];
  matieres: Matiere[] = [];

  constructor(
    private route: ActivatedRoute,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idCls = params.get('idCls');
      console.log('Classe ID:', this.idCls); 
      if (this.idCls) {
        this.loadStudents(this.idCls);
        this.loadMatieres(this.idCls);
      } else {
        console.error('Aucun ID trouvé dans l\'URL');
      }
    });
  }

  loadStudents(idCls: string): void {
    this.classeService.getClasses().subscribe(
      data => {
        const classe = data.find(c => c.idCls.toString() === idCls);
        
        if (classe && classe.etudiants) {
          this.students = classe.etudiants;
        } else {
          console.error('Classe non trouvée ou pas d\'étudiants associés');
        }
      },
      error => {
        console.error('Erreur lors de la récupération des classes :', error);
      }
    );
  }

  loadMatieres(idCls: string): void {
    this.classeService.getMatieres().subscribe(data => {
      this.matieres = data.filter(matiere =>
        matiere.notes.some(note => note.idCls.toString() === idCls)
      );
    }, error => {
      console.error('Erreur lors de la récupération des matières :', error);
    });
  }
  
  getNoteForStudent(studentId: number, matiere: Matiere): number | string {
    const note = matiere.notes.find(n => n.idCls.toString() === this.idCls && n.idEdt === studentId);
    return note ? note.note : '-'; 
  }
calculateAverageForStudent(studentId: number): number | string {
  const notes: number[] = [];
  this.matieres.forEach(matiere => {
    const noteObj = matiere.notes.find(note => note.idCls.toString() === this.idCls && note.idEdt === studentId);
    if (noteObj) {
      const weightedNote = noteObj.note * noteObj.coefficient;
      notes.push(weightedNote);
    }
  });

  const totalWeight = this.matieres
    .flatMap(matiere => matiere.notes)
    .filter(note => note.idCls.toString() === this.idCls && note.idEdt === studentId)
    .reduce((sum, note) => sum + note.coefficient, 0);

  if (notes.length > 0 && totalWeight > 0) {
    const sumWeightedNotes = notes.reduce((sum, note) => sum + note, 0);
    return (sumWeightedNotes / totalWeight).toFixed(2);
  }
  return '-';
}

getCoefficientForMatiere(matiere: Matiere): number | string {
  const note = matiere.notes.find(n => n.idCls.toString() === this.idCls);
  return note ? note.coefficient : '-';
}

getTotalNotesForStudent(studentId: number): number {
  let totalNotes = 0;

  this.matieres.forEach(matiere => {
    matiere.notes.forEach(note => {
      if (note.idCls.toString() === this.idCls && note.idEdt === studentId) {
        totalNotes += note.note; 
      }
    });
  });

  return totalNotes;
}

getTotalCoefficients(studentId: string): number {
  let totalCoefficients = 0;

  this.matieres.forEach(matiere => {
    matiere.notes.forEach(note => {
      if (note.idCls.toString() === this.idCls && note.idEdt.toString() === studentId) {
        totalCoefficients += note.coefficient;
      }
    });
  });

  return totalCoefficients;
}

}
