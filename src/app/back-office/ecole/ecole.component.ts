import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ecole',
  standalone: true,
  imports: [
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    RouterModule
  ],
  providers: [UserService],
  templateUrl: './ecole.component.html',
  styleUrls: ['./ecole.component.css'],
})
export class EcoleComponent implements OnInit {
  displayedColumns: string[] = ['idUser', 'name', 'surname', 'cin', 'email', 'roles', 'lieu'];
  dataSource: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.dataSource = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }
}
