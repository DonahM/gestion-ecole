import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormEtudiantComponent } from './add-form-etudiant.component';

describe('AddFormEtudiantComponent', () => {
  let component: AddFormEtudiantComponent;
  let fixture: ComponentFixture<AddFormEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFormEtudiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFormEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
