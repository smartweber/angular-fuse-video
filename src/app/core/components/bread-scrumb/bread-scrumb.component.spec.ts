import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadScrumbComponent } from './bread-scrumb.component';

describe('BreadScrumbComponent', () => {
  let component: BreadScrumbComponent;
  let fixture: ComponentFixture<BreadScrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadScrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadScrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
