import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableContentComponent } from './editable-content.component';

describe('EditableContentComponent', () => {
  let component: EditableContentComponent;
  let fixture: ComponentFixture<EditableContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
