import { ResultElement } from './../../results/results.component';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {

  private isNewResultEmitted = new Subject<boolean>();
  isNewResultEmitted$ = this.isNewResultEmitted.asObservable();
  private currentLang = new Subject<string>();
  currentLang$ = this.currentLang.asObservable();

  constructor(
    private dbService: NgxIndexedDBService
    ) { }

  setIsNewResultEmitted(isNewResultEmitted: boolean) {
    this.isNewResultEmitted.next(isNewResultEmitted);
  }
  setCurrentLang(currentLang: string) {
    this.currentLang.next(currentLang);
  }

  getResults(): Observable<ResultElement[]> {
    return this.dbService.getAll('results');
  }

  postResult(payload: ResultElement) {
    this.dbService.add('results', payload);
  }

  deleteResults(): Observable<ResultElement[]> {
    this.dbService.clear('results');
    return this.dbService.getAll('results');
  }
}
