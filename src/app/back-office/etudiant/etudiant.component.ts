import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AnneescolaireComponent } from '../anneescolaire/anneescolaire.component';

@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    CommonModule,
    HttpClientModule
  ],
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css'],
})
export class EtudiantComponent implements OnInit {
  displayedColumns: string[] = ['matricule', 'nom', 'prenom', 'classe', 'anneeScolaire', 'actions'];
  dataSource: MatTableDataSource<Etudiant> = new MatTableDataSource<Etudiant>([]);
  data: any[] = [];
  errorMessage: string | null = null;
  yearsSchools: Array<{ idSchool: number; annee_scolaire: string }> = [];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  openAddYearDialog() {
    const dialogRef = this.dialog.open(AnneescolaireComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadYearsSchools();
      }
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadYearsSchools();

    const id = localStorage.getItem('userData');
    console.log("Utilisateur récupéré du localStorage :", id);
    
    if (id) {
      this.loadClasses(id);
    }

    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [10, 20, 30];

    this.paginatorIntl.itemsPerPageLabel = 'Éléments par page';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      const of = ` sur ${length}`;
      return `${page * pageSize + 1} - ${Math.min((page + 1) * pageSize, length)}${of}`;
    };
  }

  loadYearsSchools(): void {
    this.http.get<{ data: { idSchool: number; annee_scolaire: string }[] }>('http://localhost:3000/api/years-school').subscribe({
      next: (response) => {
        this.yearsSchools = response.data;
        console.log("Années scolaires chargées : ", this.yearsSchools);
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les années scolaires.';
      },
    });
  }

  loadClasses(id: string): void {
    this.http.get<any[]>('http://localhost:3000/api/etudiants').subscribe({
      next: (response) => {
        console.log('Réponse API pour les étudiants:', response);
  
        const userData = JSON.parse(id); 
        const userId = userData.idUser;
  
        console.log('ID Utilisateur de localStorage:', userId);
  
        const filteredData = response.filter(student => student.idUser === userId);
  
        console.log('Étudiants filtrés :', filteredData);
  
        this.dataSource.data = this.mapData(filteredData, this.yearsSchools);
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les classes.';
      }
    });
  }
  

  mapData(data: any[], yearsSchools: Array<{ idSchool: number; annee_scolaire: string }>): Etudiant[] {
    return data.map((etudiant) => {
      const anneeScolaire = yearsSchools.find(year => year.idSchool === etudiant.idSchool)?.annee_scolaire || 'Non spécifié';
      return {
        matricule: etudiant.idEdt,
        nom: etudiant.name,
        prenom: etudiant.surname,
        classe: etudiant.classe || 'Non spécifié',
        anneeScolaire: anneeScolaire,
      };
    });
  }

  addElement() {
    const newElement: Etudiant = {
      matricule: this.dataSource.data.length + 1,
      nom: 'Nom',
      prenom: 'Prénom',
      classe: 'Classe A',
      anneeScolaire: '2023-2024',
    };

    this.dataSource.data = [...this.dataSource.data, newElement];
    this.updatePaginator();
  }

  deleteElement(matricule: number) {
    this.dataSource.data = this.dataSource.data.filter((student) => student.matricule !== matricule);
    this.updatePaginator();
  }

  private updatePaginator() {
    if (this.paginator) {
      this.paginator.length = this.dataSource.data.length;
      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
    }
  }
}

export interface Etudiant {
  matricule: number;
  nom: string;
  prenom: string;
  classe: string;
  anneeScolaire: string;
}
