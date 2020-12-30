import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { IndexedDbService } from '../shared/services/indexed-db.service';
import { DifficultyLevel, LevelTextColor } from './../app.component';

export interface ResultElement {
  position?: number;
  result: number;
  name: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  suddenDeath: boolean;
}

export interface ResultsConfig {
  dataSource: any;
  result: number;
  isShowResults: boolean;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  @Input() config: ResultsConfig;
  @Output() backEvent = new EventEmitter<boolean>();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  displayedColumns: string[] = ['position', 'result', 'name', 'difficultyLevel', 'suddenDeath'];
  currentLang: string;
  private subscription: Subscription;

  constructor(
    private indexedDbService: IndexedDbService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.fetchDataFromIndexedDB(true);
    this.subscription = this.indexedDbService.isNewResultEmitted$.subscribe(
      isNewResultEmitted => {
        if (isNewResultEmitted) {
          this.fetchDataFromIndexedDB(false);
        }
      }
    );
    this.indexedDbService.currentLang$.subscribe(x => this.currentLang = x);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.config.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.config.dataSource.paginator) {
      this.config.dataSource.paginator.firstPage();
    }
  }

  private fetchDataFromIndexedDB(firstTime: boolean) {
    this.indexedDbService.getResults().subscribe((allResults: any) => {
      this.sortResults(allResults);
      this.config.dataSource = new MatTableDataSource(allResults);
      this.config.dataSource.sort = this.sort;
      this.config.dataSource.paginator = this.paginator;

      if (!firstTime) {
        this.focusPaginatorOnNewResult();
      }
    });
  }

  private focusPaginatorOnNewResult() {
    const result = this.config.result;
    const results = this.config.dataSource.filteredData.map(x => x.result);
    const pageSize = this.config.dataSource.paginator.pageSize;
    const currentPosition = results.indexOf(result) + 1;
    const pageIndex = Math.ceil(currentPosition / pageSize) - 1;
    this.config.dataSource.paginator.pageIndex = pageIndex;
    this.config.dataSource.paginator.page.emit({
      pageInde: pageIndex
    });
  }

  private sortResults(results: any) {
    results.sort((x, y) => x.result - y.result);
    results.forEach((result, index) => {
      result.position = index + 1;
    });
  }

  private deleteResults() {
    this.indexedDbService.deleteResults().subscribe((results: ResultElement[]) => this.config.dataSource = results);
  }

  openDialog() {
    const dialogRef = this.dialog.open(ResetResultDialogComponent, {
      width: '350px',
    });

    dialogRef.componentInstance.onReset.subscribe((isReset) => {
      if (isReset) {
        this.deleteResults();
      }
    });
  }

  onBack() {
    this.backEvent.emit(false);
  }

  setLevelTextColor(lvl: 'easy' | 'medium' | 'hard') {
    switch (lvl) {
      case DifficultyLevel.Easy:
        return LevelTextColor.Easy;
      case DifficultyLevel.Medium:
        return LevelTextColor.Medium;
      case DifficultyLevel.Hard:
        return LevelTextColor.Hard;
    }
  }

}

@Component({
  selector: 'app-reset-result-dialog',
  templateUrl: './reset-results.dialog.html',
})
export class ResetResultDialogComponent {
  onReset = new EventEmitter<boolean>();
  constructor(
    public dialogRef: MatDialogRef<ResetResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public resusltComponent: ResultsComponent) {}

  onBackClick(): void {
    this.dialogRef.close();
  }

  onResetClick() {
    this.onReset.emit(true);
    this.onBackClick();
  }

}
