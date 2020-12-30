import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DifficultyLevel } from './../app.component';
import { ResultElement } from './../results/results.component';
import { IndexedDbService } from './../shared/services/indexed-db.service';

// export interface MenuConfig {
//   finalResult: number;
//   isShowResults: boolean;
// }

export interface StartGameConfig {
  isStartGame: boolean;
  isSuddenDeath: boolean;
  marginByLvl: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() config: any;
  @Output() startGameEvent = new EventEmitter<StartGameConfig>();
  @Output() changeMarginByLvlEvent = new EventEmitter<string>();
  @Output() showResultsEvent = new EventEmitter<boolean>();
  firstName = new FormControl('', [
    Validators.required,
  ]);
  level: FormGroup;
  marginByLvl = '0';

  constructor(
    private indexedDbService: IndexedDbService,
    private fb: FormBuilder,

  ) { }

  ngOnInit() {
    this.createDifficyltyFormGroup();
    this.listenOnDifficultyLevelChange();
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.toggleStartBtn();
      this.config.isNameAdded = true;
    }
  }

  private createDifficyltyFormGroup() {
    this.level = this.fb.group({
      difficultyLevel: new FormControl('easy', [
        Validators.required
      ]),
      suddenDeath: new FormControl(false,
        Validators.required
      )
    });
  }

  startGame() {
    this.startGameEvent.emit({
      isStartGame: true,
      marginByLvl: this.marginByLvl,
      isSuddenDeath: this.level.get('suddenDeath').value
    });
  }

  toggleStartBtn() {
    if (!this.config.isGameOver) {
      this.postResult(this.config.finalResult, this.firstName.value);
    }
    this.config.isGameFinished = false;
  }

  showResults() {
    this.config.isShowResults = true;
    this.showResultsEvent.emit(true);
  }

  private postResult(finalResult: number, firstName: string) {
    const payload: ResultElement = {
      name: firstName,
      result: finalResult,
      difficultyLevel: this.level.get('difficultyLevel').value,
      suddenDeath: this.level.get('suddenDeath').value
    };
    this.indexedDbService.postResult(payload);
    this.indexedDbService.setIsNewResultEmitted(true);
  }

  private listenOnDifficultyLevelChange() {
    this.level.get('difficultyLevel').valueChanges.subscribe((difficultyLevel: DifficultyLevel) => {
      switch (difficultyLevel) {
        case DifficultyLevel.Easy:
          this.marginByLvl = '0';
          break;
        case DifficultyLevel.Medium:
          this.marginByLvl = '80';
          break;
        case DifficultyLevel.Hard:
          this.marginByLvl = '150';
          break;
        default:
          break;
      }
    });
  }
}
