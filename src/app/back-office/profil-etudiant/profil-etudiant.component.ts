import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EditStudentDialogComponent } from '../edit-student-dialog/edit-student-dialog.component';
import { CommonModule } from '@angular/common';
import { BadgeDialogComponent } from '../badge-dialog/badge-dialog.component';
import { AddecolageComponent } from '../addecolage/addecolage.component';
import { StudentNotesDialogComponent } from '../student-notes-dialog/student-notes-dialog.component';

@Component({
  selector: 'app-profil-etudiant',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSortModule, 
    MatPaginatorModule, 
    HttpClientModule, 
    MatTableModule, 
    CommonModule
  ],
  templateUrl: './profil-etudiant.component.html',
  styleUrls: ['./profil-etudiant.component.css'],
})
export class ProfilEtudiantComponent implements OnInit {
  studentId: string | null = null;
  student: Student | null = null;
  errorMessage: string | null = null;

  displayedColumns: string[] = ['mois', 'statut', 'valeur', 'date'];
  dataSource = new MatTableDataSource<Ecolage>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const studentIdParam = this.route.snapshot.paramMap.get('idEdt');
    console.log('Param ID récupéré:', studentIdParam);

    this.studentId = studentIdParam;

    console.log("Student ID (Nom) : ", this.studentId);
    
    if (this.studentId) {
      this.fetchStudentByName(this.studentId);
      this.fetchEcolagesByName(this.studentId);
    } else {
      this.errorMessage = 'Nom de l’étudiant non valide.';
    }
  }

  fetchStudentByName(matricule: string): void {
  const apiUrl = `http://localhost:3000/api/etudiants/matricule/${matricule}`;
  this.http.get<Student[]>(apiUrl).subscribe({
    next: (data) => {
      if (data && data.length > 0) {
        this.student = data[0];
        console.log('Données de l’étudiant récupérées :', this.student);
        console.log(`Nom de l'étudiant: ${this.student.name}, Prénom: ${this.student.surname}`);
        if (this.student.idSchool) {
          this.fetchYearSchool(this.student.idSchool);
        }
      } else {
        this.errorMessage = 'Aucun étudiant trouvé.';
      }
    },
    error: () => {
      this.errorMessage = 'Impossible de charger les informations de l’étudiant.';
    },
  });
}

  

  fetchYearSchool(idSchool: number): void {
    const apiUrl = `http://localhost:3000/api/years-school/${idSchool}`;
    this.http.get<any>(apiUrl).subscribe({
      next: (data) => {
        if (data) {
          if (this.student) {
            this.student.years_schools = data;
          }
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de récupérer l’année scolaire.';
      },
    });
  }

  fetchEcolagesByName(name: string): void {
    const apiUrl = `http://localhost:3000/api/etudiants/${name}`;
    this.http.get<Student>(apiUrl).subscribe({
      next: (data) => {
        this.student = data;
        if (Array.isArray(data.ecolages)) {
          this.dataSource.data = data.ecolages.sort((a, b) => b.idEco - a.idEco);
        } else {
          this.dataSource.data = [];
        }

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        } 
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données des écolages.';
      },
    });
  }

  openEditDialog(field: keyof Student): void {
    if (!this.student) return;

    const dialogRef = this.dialog.open(EditStudentDialogComponent, {
      data: { field, value: this.student[field] },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.status === 'saved') {
        const newValue = result.value;
        (this.student as any)[field] = newValue;
        this.updateStudent(field, newValue);
      }
    });
  }

  
  

  openAddEcolageDialog(): void {
    const dialogRef = this.dialog.open(AddecolageComponent, {
      data: { studentId: this.student!.idEdt },
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.student) {
        this.fetchEcolagesByName(this.student.name);
      }
    });
  }

  openNotesDialog(): void {
    if (this.student) {
      const dialogRef = this.dialog.open(StudentNotesDialogComponent, {
        data: this.student,
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('Le pop-up a été fermé');
      });
    }
  }

  openBadgeDialog(): void {
    if (this.student) {
      const dialogRef = this.dialog.open(BadgeDialogComponent, {
        data: this.student,
      });

      dialogRef.afterClosed().subscribe(() => {
        console.log('Le pop-up a été fermé');
      });
    }
  }

  updateStudent(field: keyof Student, value: any): void {
    if (!this.student) return;

    const apiUrl = `http://localhost:3000/api/etudiants/${this.student.idEdt}`;
    const updateData = { [field]: value };

    this.http.patch(apiUrl, updateData).subscribe({
      next: () => {
        console.log('Mise à jour réussie');
      },
      error: () => {
        this.errorMessage = 'Impossible de mettre à jour l’étudiant.';
      },
    });
  }
}

export interface Student {
  matricule: any;
  idEdt: number;
  name: string;
  surname: string;
  date_naiss: string;
  lieu_naiss: string;
  sexe: string;
  tel: string;
  adress_edt: string;
  father: string;
  jobs_f: string;
  mother: string;
  jobs_m: string;
  tel_parent: string;
  adresse_parent: string;
  titeur: string;
  tel_titeur: string;
  adress_titeur: string;
  ecole_anter: string;
  image: string;
  idCls: number;
  classE?: {
    idCls: number;
    name: string;
  };
  idSchool: number;
  years_schools?: {
    idSchool: number;
    annee_scolaire: string;
  };
  ecolages?: {
    mois: string;
    valeur: number;
    statut: string;
    date: string;
  };
}

export interface Ecolage {
  idEco: number;
  mois: string;
  valeur: number;
  statut: string;
  date: string;
  idEdt: number;
}
