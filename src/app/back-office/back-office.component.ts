import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.css'
})
export class BackOfficeComponent {

  isMenuOpen = false;

  // Fonction pour ouvrir/fermer le menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
  scrollToSection(sectionId: string) {
    this.isMenuOpen = false; 

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }
}
