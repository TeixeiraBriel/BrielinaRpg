import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhamentoNarrativaComponent } from './detalhamento-narrativa.component';

describe('DetalhamentoNarrativaComponent', () => {
  let component: DetalhamentoNarrativaComponent;
  let fixture: ComponentFixture<DetalhamentoNarrativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalhamentoNarrativaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhamentoNarrativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
