import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  displayedColumns: string[] = ['matricule', 'nom', 'prenom', 'age', 'classe', 'annee', 'actions'];
  dataSource: MatTableDataSource<Etudiant> = new MatTableDataSource<Etudiant>([]); // Corriger ici
  data: any[] = []; // Pour stocker les données reçues de l'API
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    // Configuration du paginator
    this.paginator._intl.itemsPerPageLabel = 'Éléments par page'; // Texte personnalisé
    this.paginator.pageSize = 10; // Nombre d'éléments par défaut
    this.paginator.pageSizeOptions = [10, 20, 30]; // Options de taille de page

    // Appel API pour récupérer les données
    this.http.get('http://localhost:3000/api/classes') // Remplacez par votre URL d'API
      .subscribe({
        next: (response: any) => {
          this.data = this.mapData(response); // Traitement des données pour extraire les étudiants
          this.dataSource.data = this.data; // Met à jour la table avec les données des étudiants
        },
        error: (error) => {
          console.error('Erreur lors de l\'appel API:', error);
          this.errorMessage = 'Impossible de charger les données.'; // Message d'erreur
        }
      });
  }

  /**
   * Transforme les données des classes et étudiants en un format plat pour la table.
   */
  mapData(data: any[]): Etudiant[] {
    const result: Etudiant[] = [];
    data.forEach((classe) => {
      classe.etudiants.forEach((etudiant: any) => {
        result.push({
          matricule: etudiant.idEdt,
          nom: etudiant.name,
          prenom: etudiant.surname,
          age: etudiant.age,
          classe: classe.content,
          annee: classe.annee,
        });
      });
    });
    return result;
  }

  /**
   * Ajoute un nouvel élément à la table et met à jour le paginator.
   */
  addElement() {
    const newElement: Etudiant = {
      matricule: this.dataSource.data.length + 1,
      nom: 'Nom',
      prenom: 'Prénom',
      age: 20,
      classe: 'Classe A',
      annee: '2022-2024',
    };

    // Mise à jour des données
    this.dataSource.data = [...this.dataSource.data, newElement];

    // Met à jour le paginator après ajout
    this.updatePaginator();
  }

  /**
   * Supprime un étudiant de la table et met à jour le paginator.
   */
  deleteElement(matricule: number) {
    this.dataSource.data = this.dataSource.data.filter((student) => student.matricule !== matricule);
    this.updatePaginator(); // Met à jour le paginator après suppression
  }

  /**
   * Met à jour les informations du paginator pour qu'elles soient cohérentes.
   */
  private updatePaginator() {
    if (this.paginator) {
      this.paginator.length = this.dataSource.data.length;
      this.paginator.pageIndex = 0; // Réinitialise la page à la première après modification
      this.dataSource.paginator = this.paginator; // Synchronise les données avec le paginator
    }
  }
}

export interface Etudiant {
  matricule: number;
  nom: string;
  prenom: string;
  age: number;
  classe: string;
  annee: string;
}
