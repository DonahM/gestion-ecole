import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-admin',
  imports: [MatButtonModule, RouterModule, CommonModule, ReactiveFormsModule,FormsModule, HttpClientModule],  // MatButtonModule pour les boutons Material, RouterModule pour la navigation
  templateUrl: './form-admin.component.html',
  styleUrls: ['./form-admin.component.css']
})
export class FormAdminComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post('http://localhost:3000/api/auth', credentials)
  .subscribe(
    (response: any) => {
      console.log('Réponse de l\'API:', response);
      if (response && response.success) {
        this.router.navigate(['/back-office']);
      } else {
        alert('Authentification échouée. Veuillez vérifier vos informations.');
      }
    },
    error => {
      console.error('Erreur HTTP:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  );

    }
  }
}
