// src/app/services/classe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from '../models/classe.model';
import { Etudiant } from '../models/etudiant.model';
import { Matiere } from '../models/matiere.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
    getStudentsInClass(idCls: string): Observable<Classe[]> {
        return this.http.get<Classe[]>(`${this.apiUrl}/${idCls}`);
      }
      
  private apiUrl = 'http://localhost:3000/api/classes';
  constructor(private http: HttpClient) {}

  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(this.apiUrl);
  }

  getMatieres(): Observable<Matiere[]> {
    return this.http.get<Matiere[]>('http://localhost:3000/api/matieres');
  }  

  getClasseById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.apiUrl}/${id}`);
  }

  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.apiUrl, classe);
  }

  updateClasse(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.apiUrl}/${id}`, classe);
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
