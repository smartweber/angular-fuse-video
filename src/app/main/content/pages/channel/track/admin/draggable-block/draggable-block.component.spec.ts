import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableBlockComponent } from './draggable-block.component';

describe('DraggableBlockComponent', () => {
  let component: DraggableBlockComponent;
  let fixture: ComponentFixture<DraggableBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DraggableBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggableBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
