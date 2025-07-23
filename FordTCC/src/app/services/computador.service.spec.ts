import { TestBed } from '@angular/core/testing';

import { ComputadorService } from './computador.service';

describe('ComputadorService', () => {
  let service: ComputadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
