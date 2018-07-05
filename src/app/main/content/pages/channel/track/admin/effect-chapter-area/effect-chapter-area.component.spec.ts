import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EffectChapterAreaComponent } from './effect-chapter-area.component';

describe('EffectChapterAreaComponent', () => {
  let component: EffectChapterAreaComponent;
  let fixture: ComponentFixture<EffectChapterAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EffectChapterAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectChapterAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
