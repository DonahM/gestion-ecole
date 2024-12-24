import { Routes } from '@angular/router';
import { ClassComponent } from './back-office/class/class.component';
import { EtudiantComponent } from './back-office/etudiant/etudiant.component';
import { AddFormComponent } from './back-office/add-form/add-form.component';
import { AddFormEtudiantComponent } from './back-office/add-form-etudiant/add-form-etudiant.component';
import { ProfComponent } from './back-office/prof/prof.component';
import { ProfilEtudiantComponent } from './back-office/profil-etudiant/profil-etudiant.component';
import { ListeEtClsComponent } from './back-office/liste-et-cls/liste-et-cls.component';
import { AddFormProfComponent } from './back-office/add-form-prof/add-form-prof.component';
import { ProfileProComponent } from './back-office/profile-pro/profile-pro.component';
import { BackOfficeComponent } from './back-office/back-office.component';
import { FrontOfficeComponent } from './front-office/front-office.component';
import { AccueilComponent } from './front-office/accueil/accueil.component';
import { FormAdminComponent } from './front-office/form-admin/form-admin.component';
import { FormClientComponent } from './front-office/form-client/form-client.component';


export const routes: Routes = [
    // Redirection par défaut
    { path: '', redirectTo: 'front-office', pathMatch: 'full' },

    // Front-office routes
    { 
        path: 'front-office',
        component: FrontOfficeComponent, 
        children: 
        [
            { path: '', redirectTo: 'accueil', pathMatch: 'full' },  // Route par défaut
            { path: 'accueil', component: AccueilComponent },
            { path: 'form-admin', component: FormAdminComponent },
            { path: 'form-client', component: FormClientComponent },
        ]
    },
    
    // Back-office routes
    { 
        path: 'back-office',
        component: BackOfficeComponent, 
        children: 
        [
            { path: '', redirectTo: 'etudiant', pathMatch: 'full' },  // Route par défaut
            { path: 'etudiant', component: EtudiantComponent },
            { path: 'etudiant/addEtudiant', component: AddFormEtudiantComponent },
            { path: 'etudiant/profilEtudiant/:idEdt', component: ProfilEtudiantComponent },
            { path: 'class', component: ClassComponent },
            { path: 'class/addClass', component: AddFormComponent },
            { path: 'class/listEtClass/:className', component: ListeEtClsComponent },
            { path: 'prof', component: ProfComponent },
            { path: 'prof/profile/:idProf', component: ProfileProComponent },
            { path: 'prof/add-form-prof', component: AddFormProfComponent },
        ]
    },

    
    
    
];
