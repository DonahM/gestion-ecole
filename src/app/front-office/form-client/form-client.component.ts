import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-client',
  imports: [MatButtonModule, RouterModule, CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './form-client.component.html',
  styleUrl: './form-client.component.css'
})
export class FormClientComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      idEdt: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post('http://localhost:3000/api/auth-client/authenticate', credentials)
  .subscribe(
    (response: any) => {
      console.log('Réponse de l\'API:', response);
      if (response && response.success) {
        this.router.navigate(['/front-office/client', response.data.idEdt]);
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
