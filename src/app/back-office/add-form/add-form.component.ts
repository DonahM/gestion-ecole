import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

export interface Teacher {
  idProf: number;
  name: string;
  surname: string;
}

@Component({
  selector: 'app-add-form',
  standalone: true,
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule,
    HttpClientModule,
    MatButtonModule
],
})
export class AddFormComponent {
  addClassForm: FormGroup;
  teachers: Teacher[] = [];
  yearsSchools: Array<{ idSchool: number; annee_scolaire: string }> = [];
  idUser: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.addClassForm = this.fb.group({
      name: ['', Validators.required],
      titulaire: ['', Validators.required],
      num: ['', Validators.required],
      idSchool: ['', Validators.required], 
    });
  }

  ngOnInit() {
    const userData = localStorage.getItem('userData');
    const connectedUser = userData ? JSON.parse(userData) : null;

    if (connectedUser && connectedUser.idUser) {
      this.idUser = connectedUser.idUser;
    } else {
      alert('Utilisateur non connecté. Veuillez vous reconnecter.');
    }
    this.http.get<Teacher[]>('http://localhost:3000/api/professeurs').subscribe({
      next: (data) => {
        this.teachers = Array.isArray(data) ? data : [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des enseignants :', error);
      },
    });
  
    this.http.get<{ data: { idSchool: number; annee_scolaire: string }[] }>('http://localhost:3000/api/years-school').subscribe({
      next: (response) => {
        console.log('Données reçues pour yearsSchools :', response);
        this.yearsSchools = Array.isArray(response.data) ? response.data.sort((a, b) => {
          return parseInt(b.annee_scolaire.split('-')[0]) - parseInt(a.annee_scolaire.split('-')[0]);
        }) : [];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des années scolaires :', error);
      },
    });
  }
  

  onSubmit() {
    if (this.addClassForm.valid) {
      const apiUrl = 'http://localhost:3000/api/classes';

      const formData = {
        ...this.addClassForm.value,
        idUser: this.idUser,
      };

      this.http.post(apiUrl, formData).subscribe(
        (response) => {
          console.log('Classe ajoutée avec succès :', response);
          alert('Classe ajoutée avec succès !');
          this.addClassForm.reset();
          this.router.navigate(['/back-office/class']);
        },
        (error) => {
          console.error('Erreur lors de l’ajout de la classe :', error);
          alert('Erreur lors de l’ajout de la classe.');
        }
      );
    } else {
      alert('Veuillez remplir tous les champs obligatoires.');
    }
  }
}
