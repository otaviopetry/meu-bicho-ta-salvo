import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalGalleryComponent } from './animal-gallery.component';

describe('AnimalGalleryComponent', () => {
  let component: AnimalGalleryComponent;
  let fixture: ComponentFixture<AnimalGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalGalleryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimalGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
