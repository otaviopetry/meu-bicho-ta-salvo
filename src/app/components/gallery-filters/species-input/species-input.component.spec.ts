import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeciesInputComponent } from './species-input.component';

describe('SpeciesInputComponent', () => {
  let component: SpeciesInputComponent;
  let fixture: ComponentFixture<SpeciesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeciesInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpeciesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
