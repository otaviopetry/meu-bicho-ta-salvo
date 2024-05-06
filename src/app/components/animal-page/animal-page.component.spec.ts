import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalPageComponent } from './animal-page.component';

describe('AnimalPageComponent', () => {
  let component: AnimalPageComponent;
  let fixture: ComponentFixture<AnimalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
