import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-form-etudiant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './add-form-etudiant.component.html',
  styleUrls: ['./add-form-etudiant.component.css'],
})
export class AddFormEtudiantComponent implements OnInit {
  studentForm: FormGroup;
  classes: Array<{ idCls: number; name: string }> = [];
  yearsSchools: Array<{ idSchool: number; annee_scolaire: string }> = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.studentForm = this.fb.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        date_naiss: ['', Validators.required],
        lieu_naiss: ['', Validators.required],
        sexe: ['', Validators.required],
        tel: ['', Validators.required],
        adress_edt: ['', Validators.required],
        matricule: ['', Validators.required],
        father: ['', Validators.required],
        jobs_f: [''],
        mother: ['', Validators.required],
        jobs_m: [''],
        tel_parent: ['', Validators.required],
        adresse_parent: ['', Validators.required],
        titeur: [''],
        tel_titeur: [''],
        adress_titeur: [''],
        ecole_anter: [''],
        image: [''],
        idCls: ['', Validators.required],
        idSchool: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator } // Validateur personnalisé
    );
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('userData');
    console.log(userData);
    
    this.loadClasses();
    this.loadYearsSchools();
  }

  loadClasses(): void {
    this.http.get<{ idCls: number; name: string }[]>('http://localhost:3000/api/classes').subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.classes = data;
        } else {
          console.error('Format inattendu pour les classes:', data);
        }
      },
      error: (error) => console.error('Erreur lors du chargement des classes:', error),
    });
  }

  loadYearsSchools(): void {
    this.http
      .get<{ data: { idSchool: number; annee_scolaire: string }[]; total: number }>(
        'http://localhost:3000/api/years-school'
      )
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.data)) {
            this.yearsSchools = response.data;
          } else {
            console.error('Format inattendu pour les années scolaires:', response);
          }
        },
        error: (error) => console.error('Erreur lors du chargement des années scolaires:', error),
      });
  }

  // Validateur personnalisé pour vérifier si les mots de passe correspondent
  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  // onSubmit(): void {
  //   if (this.studentForm.valid) {
  //     // Exclure `confirmPassword` avant d'envoyer les données au serveur
  //     const { confirmPassword, ...studentData } = this.studentForm.value;
  //     this.http.post('http://localhost:3000/api/etudiants', studentData).subscribe({
  //       next: (response) => {
  //         console.log('Étudiant ajouté avec succès:', response);
  //         this.router.navigate(['/back-office/etudiant']);
  //       },
  //       error: (error) => console.error('Erreur lors de l\'ajout de l\'étudiant:', error),
  //     });
  //   } else {
  //     console.warn('Formulaire invalide:', this.studentForm.value);
  //   }
  // }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const { confirmPassword, ...studentData } = this.studentForm.value;
  
      // Récupérer les données de l'utilisateur connecté
      const userData = localStorage.getItem('userData');
      if (userData) {
        const currentUser = JSON.parse(userData);

        const data = {...studentData, idUser: currentUser.idUser}
        console.log(data);
        
        this.http.post('http://localhost:3000/api/etudiants', data).subscribe({
          next: (response) => {
            console.log('Étudiant ajouté avec succès:', response);
            this.router.navigate(['/back-office/etudiant']);
          },
          error: (error) => console.error('Erreur lors de l\'ajout de l\'étudiant:', error),
        });
      } else {
        console.warn('Formulaire invalide:', this.studentForm.value);
      }
      } else {
        console.error('Utilisateur non authentifié.');
        return; // Arrête le treuhugegeaitement si aucune information utilisateur n'est trouvée
      }

  }
  
}
