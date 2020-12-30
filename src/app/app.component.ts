import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { GameComponent, GameOver } from './game/game.component';
import { MenuComponent, StartGameConfig } from './menu/menu.component';

export enum DifficultyLevel {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard'
}

export enum LevelTextColor {
  Easy = 'green',
  Medium = 'orange',
  Hard = 'red'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(GameComponent, { static: false }) gameComponent: GameComponent;
  @ViewChild(MenuComponent, { static: false }) menuComponent: MenuComponent;
  menuConfig: any = {};
  resultsConfig: any = {};
  private reflexGameTitle: string;
  private resultsTitle: string;
  private gameTitle: string;

  constructor(
    private translate: TranslateService,
    private titleService: Title
  ) {
    translate.setDefaultLang('pl');
    translate.use(translate.getBrowserLang());
  }

  ngOnInit(): void {
    this.menuConfig.isBoardGame = false;
    this.menuConfig.isShowResults = false;
    this.onLangChange();
  }

  startGame(startGameConfig: StartGameConfig) {
    if (this.gameComponent) {
      this.gameComponent.startGame(startGameConfig.marginByLvl, startGameConfig.isSuddenDeath);
      this.menuConfig.isBoardGame = true;
      this.titleService.setTitle(this.gameTitle);
    }
  }

  reset() {
    // this.menuConfig = {
    //   isGameFinished: false,
    //   isBoardGame: false,
    //   newRecord: false,
    //   isNameAdded: false
    // };
    this.menuConfig.isGameFinished = true;
    this.menuConfig.isBoardGame = false;
    this.menuConfig.newRecord = false;
    this.menuConfig.isNameAdded = false;
  }

  onFinishGame(gameOverObj: GameOver) {
    this.reset();
    this.menuComponent.firstName.setValue('');
    this.titleService.setTitle(this.reflexGameTitle);
    if (gameOverObj.isGameOver) {
      this.menuConfig.isGameOver = true;
      return;
    }
    if (gameOverObj.isGame) {
      this.menuConfig.isGameOver = false;
      this.resultsConfig.result = gameOverObj.finalResult;
      this.menuConfig.finalResult = gameOverObj.finalResult;
    }
  }

  showResults() {
    this.menuConfig.isShowResults = true;
  }

  onBack(event: boolean) {
    this.resultsConfig.isShowResults = event;
    this.menuConfig.isShowResults = event;
    this.titleService.setTitle(this.reflexGameTitle);

  }

  onShowResults(isShowResults: boolean) {
    this.resultsConfig.isShowResults = isShowResults;
    this.titleService.setTitle(this.resultsTitle);
  }

  private onLangChange() {
    this.translate
      .onLangChange
      .subscribe(translations => {
        this.reflexGameTitle = translations.translations.PAGE_TITLES.REFLEX_GAME;
        this.gameTitle = translations.translations.PAGE_TITLES.GAME;
        this.resultsTitle = translations.translations.PAGE_TITLES.RESULTS;
        if (!this.menuConfig.isShowResults) {
          this.titleService.setTitle(this.reflexGameTitle);
        } else {
          this.titleService.setTitle(this.resultsTitle);
        }
      });
  }
}
