import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-pro',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './profile-pro.component.html',
  styleUrl: './profile-pro.component.css'
})
export class ProfileProComponent implements OnInit {
  prof: Prof | null = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const idProf = this.route.snapshot.paramMap.get('idProf');
    if (idProf) {
      this.fetchProfDetails(Number(idProf));
    }
  }

  fetchProfDetails(idProf: number) {
    this.http.get<Prof>(`http://localhost:3000/api/professeurs/${idProf}`).subscribe({
      next: (response) => {
        this.prof = response;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails du professeur :', error);
        this.errorMessage = 'Impossible de charger les détails du professeur.';
      }
    });
  }
  
}
export interface Prof {
  idProf: number;
  name: string;
  surname: string;
  matiere: string;
  salaires?: string[]; 
}