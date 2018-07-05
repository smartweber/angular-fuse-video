import { TestBed, inject } from '@angular/core/testing';

import { ChannelHomeService } from './channel-home.service';

describe('ChannelHomeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelHomeService]
    });
  });

  it('should be created', inject([ChannelHomeService], (service: ChannelHomeService) => {
    expect(service).toBeTruthy();
  }));
});
