import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectActionAreaComponent } from './effect-action-area.component';

describe('EffectActionAreaComponent', () => {
  let component: EffectActionAreaComponent;
  let fixture: ComponentFixture<EffectActionAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectActionAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectActionAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
