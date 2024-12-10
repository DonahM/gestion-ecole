import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-profil-form-etudiant',
  imports: [RouterModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './profil-form-etudiant.component.html',
  styleUrl: './profil-form-etudiant.component.css'
})
export class ProfilFormEtudiantComponent {

}
