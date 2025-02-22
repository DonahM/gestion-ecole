import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';  // Importez ActivatedRoute
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  client: any = null;  // Initialisez 'client' à null ou un objet vide.

  // Injectez ActivatedRoute pour accéder aux paramètres de la route
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const idEdt = this.route.snapshot.paramMap.get('idEdt'); // Utilisez 'route' pour accéder aux paramètres
    console.log("ghfghghh: ", idEdt)
    if (idEdt) {
      this.http.get(`http://localhost:3000/api/etudiants/id/${idEdt}`).subscribe({
        next: (data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            this.client = data[0];  // Accédez au premier objet du tableau
            console.log('Nom du client:', this.client.name);  // Affiche le nom dans la console
          } else {
            console.warn('Aucune donnée trouvée');
          }
        }
        
        // error: (err) => {
        //   console.error('Erreur lors de la récupération des données', err);
        // }
      });
    }
  }
}
