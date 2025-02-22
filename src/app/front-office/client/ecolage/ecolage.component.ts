import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Ecolage, Student } from '../../../back-office/profil-etudiant/profil-etudiant.component';
import { AddecolageComponent } from '../../../back-office/addecolage/addecolage.component';

@Component({
  standalone: true,
  selector: 'app-ecolage',
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './ecolage.component.html',
  styleUrls: ['./ecolage.component.css'],
})
export class EcolageComponent implements OnInit {
  client: any;
  studentId: number | null = null;
  student: Student | null = null;
  errorMessage: string | null = null;

  displayedColumns: string[] = ['mois', 'valeur', 'date', 'statut'];
  dataSource = new MatTableDataSource<Ecolage>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {}

  fetchEcolages(id: number): void {
    const apiUrl = `http://localhost:3000/api/etudiants/${id}`;
    this.http.get<Student>(apiUrl).subscribe({
      next: (data) => {
        this.student = data;
        if (Array.isArray(data.ecolages)) {
          const ecolagesWithYears = data.ecolages.map((ecolage) => {
            const anneeScolaire = ecolage.years_schools ? ecolage.years_schools.annee_scolaire : 'Non spécifiée';
            // console.log("test345: ", anneeScolaire)
            return { ...ecolage, annee_scolaire: anneeScolaire };
          });

          this.dataSource.data = ecolagesWithYears.sort((a, b) => b.idEco - a.idEco);
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        } else {
          this.dataSource.data = [];
        }
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les données des écolages.';
      },
    });
  }



  openAddEcolageDialog(): void {
    const dialogRef = this.dialog.open(AddecolageComponent, {
      data: { studentId: this.student!.idEdt },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.fetchEcolages(this.student!.idEdt);
      }
    });
  }

  ngOnInit(): void {
    const name = this.route.parent?.snapshot.paramMap.get('name');
    console.log('Matricule:', name);
    if (name) {
      this.http.get(`http://localhost:3000/api/etudiants/${name}`).subscribe({
        next: (data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            this.client = data[0];
            console.log('Client trouvé:', this.client); 
            this.fetchEcolages(this.client.idEdt);
          } else {
            console.warn('Aucune donnée trouvée');
          }
        },
      });
    }
  }
  
}
