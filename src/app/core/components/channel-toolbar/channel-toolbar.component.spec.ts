import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelToolbarComponent } from './channel-toolbar.component';

describe('ChannelToolbarComponent', () => {
  let component: ChannelToolbarComponent;
  let fixture: ComponentFixture<ChannelToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
