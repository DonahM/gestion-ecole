import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
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

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  openAddYearDialog() {
    const dialogRef = this.dialog.open(AnneescolaireComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadYearsSchools(); // Recharge les années scolaires après ajout
      }
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadYearsSchools(); // Charger les années scolaires

    const id = localStorage.getItem('id'); // Récupère un id à partir du stockage local
    console.log("test: ",id )
    if (id) {
      this.loadClasses(id); // Charge les classes pour l'id stocké
    }

    this.paginator._intl.itemsPerPageLabel = 'Éléments par page';
    this.paginator.pageSize = 10;
    this.paginator.pageSizeOptions = [10, 20, 30];
  }

  loadYearsSchools(): void {
    this.http.get<{ data: { idSchool: number; annee_scolaire: string }[]; total: number }>('http://localhost:3000/api/years-school').subscribe({
      next: (response) => {
        console.log('Années scolaires récupérées:', response.data);  // Affiche la propriété 'data' dans la console
        this.yearsSchools = response.data;  // Stocke les années scolaires
      },
      error: (error) => {
        console.error('Erreur lors du chargement des années scolaires:', error);
        this.errorMessage = 'Impossible de charger les années scolaires.';
      },
    });
  }

  loadClasses(id: string): void {
    if (!id) {
      console.error('ID manquant pour charger les classes.');
      return;
    }

    this.http.get(`http://localhost:3000/api/classes/${id}`).subscribe({
      next: (response: any) => {
        
        console.log('Classes récupérées:', response);
        this.data = this.mapData(response, this.yearsSchools);
        this.dataSource.data = this.data;
      },
      error: (error) => {
        console.error('Erreur lors de l\'appel API pour les classes:', error);
        this.errorMessage = 'Impossible de charger les classes.';
      }
    });
  }

  mapData(data: any[], yearsSchools: Array<{ idSchool: number; annee_scolaire: string }>): Etudiant[] {
    const result: Etudiant[] = [];
    
    if (!Array.isArray(yearsSchools)) {
      console.error('yearsSchools n\'est pas un tableau');
      return result;
    }

    data.forEach((classe) => {
      classe.etudiants.forEach((etudiant: any) => {
        const anneeScolaire = etudiant.idSchool
          ? yearsSchools.find(year => year.idSchool === etudiant.idSchool)?.annee_scolaire
          : 'Non spécifié';

        result.push({
          matricule: etudiant.idEdt,
          nom: etudiant.name,
          prenom: etudiant.surname,
          classe: classe.name,
          anneeScolaire: anneeScolaire || 'Non spécifié',
        });
      });
    });

    return result;
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
