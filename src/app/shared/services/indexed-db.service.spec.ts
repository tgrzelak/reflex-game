import { TestBed } from '@angular/core/testing';
import { IndexedDbService } from './indexed-db.service';

describe('IndexedDbServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IndexedDbService = TestBed.get(IndexedDbService);
    expect(service).toBeTruthy();
  });
});
