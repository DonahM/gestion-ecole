export interface Note {
    idNot: number;
    note: number;
    coefficient: number;
    idEdt: number;
    idMat: number;
    idSchool: number;
    idSem: number;
    idCls: number;
  }
  
  export interface Matiere {
    coefficient: number;
    idMat: number;
    name: string;
    idEdt: number;
    idSchool: number;
    notes: Note[];
  }
  