import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Ajout de CommonModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule], // Ajout de CommonModule ici
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'MSchool';
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
