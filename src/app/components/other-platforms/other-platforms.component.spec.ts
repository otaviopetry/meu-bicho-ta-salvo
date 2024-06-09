import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlatformsComponent } from './other-platforms.component';

describe('OtherPlatformsComponent', () => {
  let component: OtherPlatformsComponent;
  let fixture: ComponentFixture<OtherPlatformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPlatformsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherPlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
