export interface Student {
    idEdt: number;
    name: string;
    surname: string;
    date_naiss: string;
    lieu_naiss: string;
    sexe: string;
    tel: string;
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
    annee: string;
    idCls: number;
    classE?: {
      idCls: number;
      name: string;
    };
  }
  