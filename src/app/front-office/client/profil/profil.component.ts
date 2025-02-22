import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';  // Importez ActivatedRoute
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit  {
  client: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const idEdt = this.route.parent?.snapshot.paramMap.get('idEdt');  // Récupère le paramètre 'idEdt' du composant parent
    // console.log( "test64646: ", idEdt)
    if (idEdt) {
      this.http.get(`http://localhost:3000/api/etudiants/id/${idEdt}`).subscribe({
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
