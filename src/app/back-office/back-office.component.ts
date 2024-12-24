import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.css'
})
export class BackOfficeComponent {
  data: any; // Pour stocker les données reçues
  errorMessage: string | null = null; // Pour gérer les erreurs

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Exemple d'appel API
    this.http.get('http://localhost:3000/api/classes') // Remplacez par votre URL d'API
      .subscribe({
        next: (response) => {
          this.data = response; // Stocke les données reçues
        },
        error: (error) => {
          console.error('Erreur lors de l\'appel API:', error);
          this.errorMessage = 'Impossible de charger les données.'; // Message d'erreur
        }
      });
  }
}
