import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SexInputComponent } from './sex-input.component';

describe('SexInputComponent', () => {
  let component: SexInputComponent;
  let fixture: ComponentFixture<SexInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SexInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SexInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
