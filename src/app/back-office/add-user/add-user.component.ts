import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UserService],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user = {
    name: '',
    surname: '',
    cin: '',
    email: '',
    roles: [] as string[],
    logo: '',
    lieu: '',
    password: ''
  };
  selectedRoles = {
    admin: false,
    user: false,
    enseignant: false
  };

  constructor(private userService: UserService) {}

  onSubmit() {
    this.user.roles = [];
    
    if (this.selectedRoles.admin) this.user.roles.push('ADMIN');
    if (this.selectedRoles.user) this.user.roles.push('USER');
    if (this.selectedRoles.enseignant) this.user.roles.push('ENSEIGNANT');

    if (this.user.name && this.user.surname && this.user.cin && this.user.email && this.user.roles.length && this.user.lieu && this.user.password) {
      this.userService.addUser(this.user).subscribe(
        (response) => {
          console.log('Utilisateur ajouté avec succès:', response);
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
          alert(`Erreur: ${error.status} - ${error.statusText}. Détails: ${error.error.message || error.error}`);
        }
      );
    } else {
      alert('Tous les champs sont requis.');
    }
  }
  
}
