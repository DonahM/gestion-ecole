import { Routes } from '@angular/router';
import { ClassComponent } from './back-office/class/class.component';
import { EtudiantComponent } from './back-office/etudiant/etudiant.component';
import { AddFormComponent } from './back-office/add-form/add-form.component';
import { AddFormEtudiantComponent } from './back-office/add-form-etudiant/add-form-etudiant.component';
import { ProfilFormEtudiantComponent } from './back-office/profil-form-etudiant/profil-form-etudiant.component';

export const routes: Routes = [
    { path: '',redirectTo:'back-office/etudiant', pathMatch: 'full' },
    { path: 'back-office/etudiant', component: EtudiantComponent },
    { path: 'back-office/etudiant/formProfil', component:  ProfilFormEtudiantComponent},
    { path: 'back-office/etudiant/addEtudiant', component: AddFormEtudiantComponent },
    { path: 'back-office/class', component: ClassComponent },
    { path: 'back-office/class/addClass', component: AddFormComponent },
];
