import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';  // Importez ActivatedRoute
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ecolage',
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './ecolage.component.html',
  styleUrl: './ecolage.component.css'
})
export class EcolageComponent implements OnInit {
  client: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const matricule = this.route.parent?.snapshot.paramMap.get('matricule');  // Récupère le paramètre 'matricule' du composant parent
    if (matricule) {
      this.http.get(`http://localhost:3000/api/etudiants/matricule/${matricule}`).subscribe({
        next: (data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            this.client = data[0];
          } else {
            console.warn('Aucune donnée trouvée');
          }
        }
      });
    }
  }
}
