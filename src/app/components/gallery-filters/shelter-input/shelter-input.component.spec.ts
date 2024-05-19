import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterInputComponent } from './shelter-input.component';

describe('ShelterInputComponent', () => {
  let component: ShelterInputComponent;
  let fixture: ComponentFixture<ShelterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShelterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
