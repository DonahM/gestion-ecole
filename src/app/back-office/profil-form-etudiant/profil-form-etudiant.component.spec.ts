import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilFormEtudiantComponent } from './profil-form-etudiant.component';

describe('ProfilFormEtudiantComponent', () => {
  let component: ProfilFormEtudiantComponent;
  let fixture: ComponentFixture<ProfilFormEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilFormEtudiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilFormEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
