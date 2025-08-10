import { TestBed } from '@angular/core/testing';

import { UserStreamService } from './user-stream.service';

describe('UserStreamService', () => {
  let service: UserStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
