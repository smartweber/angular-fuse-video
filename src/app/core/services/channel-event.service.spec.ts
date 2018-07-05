import { TestBed, inject } from '@angular/core/testing';

import { ChannelEventService } from './channel-event.service';

describe('ChannelEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelEventService]
    });
  });

  it('should be created', inject([ChannelEventService], (service: ChannelEventService) => {
    expect(service).toBeTruthy();
  }));
});
