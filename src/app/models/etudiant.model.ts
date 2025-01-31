export interface Etudiant {
    idEdt: number;
    name: string;
    surname: string;
    date_naiss: string;
    lieu_naiss: string;
    sexe: string;
    tel: string;
    matricule: number;
    adress_edt: string;
    father: string;
    jobs_f: string;
    mother: string;
    jobs_m: string;
    tel_parent: string;
    adresse_parent: string;
    titeur: string;
    tel_titeur: string;
    adress_titeur: string;
    ecole_anter: string;
    image: string;
    password: string;
    idCls: number;
    classE?: any;
    idSchool: number;
    years_schools?: any;
    idUser: number;
    user?: any;
    ecolages: any[];
    matieres: any[];
    notes: any[];
  }
  