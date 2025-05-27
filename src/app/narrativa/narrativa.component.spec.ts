import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NarrativaComponent } from './narrativa.component';

describe('NarrativaComponent', () => {
  let component: NarrativaComponent;
  let fixture: ComponentFixture<NarrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NarrativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NarrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
