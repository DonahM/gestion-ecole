import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-liste-et-cls',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, HttpClientModule, MatIconModule, RouterModule, 
    CommonModule, ReactiveFormsModule
  ],
  templateUrl: './liste-et-cls.component.html',
  styleUrls: ['./liste-et-cls.component.css']
})
export class ListeEtClsComponent implements OnInit {
  className!: string;
  students: any[] = [];
  dataSource = new MatTableDataSource<any>(this.students);
  displayedColumns: string[] = ['voir', 'nom', 'prenom', 'note', 'coefficient', 'actions'];
  matiereForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  apiUrl = 'http://localhost:3000/api/notes';

  constructor(private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder) {
    this.matiereForm = this.fb.group({
      note: ['', [Validators.required, Validators.maxLength(225)]],
      coefficient: ['', [Validators.required, Validators.maxLength(225)]],
      idMat: ['', Validators.required],
      idSem: ['', Validators.required],
      idSchool: ['', Validators.required]
    });
  }

  get studentCount(): number {
    return this.students.length;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idCls = +params['idCls'];
      this.loadStudents(idCls);
    });
  }

  loadStudents(idCls: number) {
    const apiUrl = 'http://localhost:3000/api/classes';
    this.http.get<any[]>(apiUrl).subscribe(
      (classes) => {
        const selectedClass = classes.find(cls => cls.idCls === idCls);
        if (selectedClass) {
          this.students = selectedClass.etudiants;
          this.className = selectedClass.name;
          this.dataSource.data = this.students;
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des classes :', error);
      }
    );
  }

  onSubmit() {
    const allNotes = this.collectAllMatiereData();
    if (allNotes.length > 0) {
      this.addAllMatieres(allNotes);
    }
  }

  collectAllMatiereData() {
    return this.students.map(student => ({
      note: this.matiereForm.get('note')?.value,
      coefficient: this.matiereForm.get('coefficient')?.value,
      idEdt: student.idEdt,
      idMat: this.matiereForm.get('idMat')?.value,
      idSem: this.matiereForm.get('idSem')?.value,
      idSchool: this.matiereForm.get('idSchool')?.value,
      idCls: student.idCls 
    }));
  }

  addAllMatieres(notesData: any[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    notesData.forEach(note => {
      this.http.post(this.apiUrl, note, { headers }).subscribe(
        response => {
          console.log('Note ajoutée avec succès', response);
        },
        error => {
          console.error('Erreur lors de l\'ajout des notes', error);
        }
      );
    });
  }

}
