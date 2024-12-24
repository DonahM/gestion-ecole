import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddecolageComponent } from './addecolage.component';

describe('AddecolageComponent', () => {
  let component: AddecolageComponent;
  let fixture: ComponentFixture<AddecolageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddecolageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddecolageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
