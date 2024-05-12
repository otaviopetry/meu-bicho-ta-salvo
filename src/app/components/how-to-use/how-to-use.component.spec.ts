import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToUseComponent } from './how-to-use.component';

describe('HowToUseComponent', () => {
  let component: HowToUseComponent;
  let fixture: ComponentFixture<HowToUseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToUseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowToUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
