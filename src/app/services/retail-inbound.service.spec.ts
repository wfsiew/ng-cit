import { TestBed } from '@angular/core/testing';

import { RetailInboundService } from './retail-inbound.service';

describe('RetailInboundService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RetailInboundService = TestBed.get(RetailInboundService);
    expect(service).toBeTruthy();
  });
});
