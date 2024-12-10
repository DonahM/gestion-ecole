import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-class',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule, RouterModule, HttpClientModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent {
  classes: any[] = [];  // Tableau pour stocker les classes récupérées
  errorMessage: string | null = null; // Pour afficher un message d'erreur

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/classes')  // Remplacez par l'URL de votre API
      .subscribe({
        next: (response) => {
          console.log('Classes reçues:', response);  // Affiche les données dans la console
          this.classes = response;  // Stocke les classes dans le tableau
          this.cdr.detectChanges();  // Force la détection des changements pour mettre à jour le DOM
        },
        error: (error) => {
          console.error('Erreur lors de l\'appel API:', error);
          this.errorMessage = 'Impossible de charger les données des classes.';
        }
      });
  }
}
