import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Classe } from '../../models/classe.model';
import { ClasseService } from '../../services/classe.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-table-note',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [ClasseService],
  templateUrl: './table-note.component.html',
  styleUrls: ['./table-note.component.css'],
})
export class TableNoteComponent implements OnInit {
  classes: Classe[] = [];
  displayedColumns: string[] = ['idCls', 'name', 'titulaire', 'num', 'anneeScolaire', 'actions'];
  dataSource = new MatTableDataSource<Classe>(this.classes);
  currentUser: any; 

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    private classeService: ClasseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserConnection();
    this.loadClasses();
  }

  checkUserConnection(): void {
    const userData = localStorage.getItem('userData');

    if (!userData) {
      alert('Utilisateur non connecté. Veuillez vous reconnecter.');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = JSON.parse(userData);
    console.log('Utilisateur connecté :', this.currentUser);
  }

  loadClasses(): void {
    if (!this.currentUser) {
      return;
    }

    this.classeService.getClasses().subscribe(
      (data: Classe[]) => {
        this.classes = data.filter((classe) => classe.idUser === this.currentUser.idUser);
        this.dataSource.data = this.classes;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.error('Erreur de récupération des classes :', error);
      }
    );
  }
  viewNotes(idCls: number): void {
    this.router.navigate([`/tablenote/tablenoteclasse/${idCls}`]);
  }
}
