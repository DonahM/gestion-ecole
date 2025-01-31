import { Etudiant } from './etudiant.model';

export interface Classe {
  idUser: any;
  anneeScolaire: any;
  idCls: number;
  name: string;
  titulaire: string;
  num: string;
  idSchool: number;
  yearsSchools?: YearsSchools;  // Relation optionnelle
  etudiants: Etudiant[];        // Liste d'étudiants
  notes: Note[];                // Liste de notes
}

export interface YearsSchools {
  idSchool: number;
  year: string;
}

export interface Note {
  idNote: number;
  value: number;
  studentId: number;
  classeId: number;
}
