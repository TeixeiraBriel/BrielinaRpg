import { TestBed } from '@angular/core/testing';

import { NarrativasService } from './narrativas.service';

describe('NarrativasService', () => {
  let service: NarrativasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NarrativasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
