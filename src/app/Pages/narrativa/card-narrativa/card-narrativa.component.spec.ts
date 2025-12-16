import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNarrativaComponent } from './card-narrativa.component';

describe('CardNarrativaComponent', () => {
  let component: CardNarrativaComponent;
  let fixture: ComponentFixture<CardNarrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardNarrativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardNarrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
