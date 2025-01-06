import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-liste-et-cls',
  imports: [MatTableModule, MatPaginatorModule, HttpClientModule, MatIconModule, RouterModule],
  templateUrl: './liste-et-cls.component.html',
  styleUrl: './liste-et-cls.component.css'
})
export class ListeEtClsComponent {
  className!: string;
  students: any[] = [];
  displayedColumns: string[] = ['matricule', 'nom', 'prenom', 'classe', 'actions'];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.className = params['className']; // Récupère le nom de la classe depuis l'URL
      this.loadStudents(); // Charge les étudiants de la classe
    });
  }

  loadStudents() {
    const apiUrl = `http://localhost:3000/api/etudiants?className=${this.className}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        this.students = response;
      },
      (error) => {
        console.error('Erreur lors du chargement des étudiants :', error);
      }
    );
  }
}
