import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-form-etudiant',
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, RouterModule],
  templateUrl: './add-form-etudiant.component.html',
  styleUrl: './add-form-etudiant.component.css'
})
export class AddFormEtudiantComponent {

}
