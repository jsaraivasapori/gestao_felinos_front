import { TestBed } from '@angular/core/testing';

import { FelinoServiceService } from './felino.service';

describe('FelinoServiceService', () => {
  let service: FelinoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FelinoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
