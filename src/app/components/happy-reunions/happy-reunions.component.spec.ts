import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyReunionsComponent } from './happy-reunions.component';

describe('HappyReunionsComponent', () => {
  let component: HappyReunionsComponent;
  let fixture: ComponentFixture<HappyReunionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HappyReunionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HappyReunionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
