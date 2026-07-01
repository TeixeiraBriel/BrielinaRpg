import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerafinsHomeComponent } from './home.component';

describe('SerafinsHomeComponent', () => {
  let component: SerafinsHomeComponent;
  let fixture: ComponentFixture<SerafinsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SerafinsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerafinsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
