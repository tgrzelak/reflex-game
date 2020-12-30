import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

const GAME_COUNTER = 8;

export interface GameOver {
  isGame: boolean;
  isGameOver: boolean;
  finalResult: number;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  @Output() finishGameEvent = new EventEmitter<GameOver>();

  public isSuddenDeath = false;
  marginByLvl: string;
  tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  activeTileIndex: number;
  timerRef;
  counter = 0;
  finalResult: number;
  isGame = false;
  time: number;
  timeFormat: string;

  constructor() { }

  ngOnInit() {
    this.timeFormat = 's \'Sekund\' SSS \'Milisekund\'';
  }

  public startGame(marginByLvl: string, isSuddenDeath: boolean) {
    this.startTimer();
    this.isGame = true;
    this.marginByLvl = marginByLvl;
    this.isSuddenDeath = isSuddenDeath;
    this.activeTileIndex = Math.floor(Math.random() * 9) + 1;
  }

  onTileClick() {
    this.changeActiveTileIndex();
    this.counter++;
    if (this.counter === GAME_COUNTER) {
      this.finishGame();
    }
  }

  onClickedOutside(event: HTMLElement) {
    const outerHTML: string = event.outerHTML;
    if (outerHTML.length > 1000) {
      this.finishGame(true);
    }
  }

  private changeActiveTileIndex() {
    const newActiveTileIndex = Math.floor(Math.random() * 9) + 1;
    if (newActiveTileIndex !== this.activeTileIndex) {
      this.activeTileIndex = newActiveTileIndex;
    } else {
      this.changeActiveTileIndex();
    }
  }

  private finishGame(isSuddenDeath = false) {
    this.isGame = false;
    this.counter = 0;
    this.clearTimer();
    this.finishGameEvent.emit({
      isGame: true,
      finalResult: this.finalResult,
      isGameOver: isSuddenDeath
    });
  }

  private startTimer() {
    const startTime = Date.now();
    this.timerRef = setInterval(() => {
      this.time = Date.now() - startTime;
    });
  }

  private clearTimer() {
    this.finalResult = this.time;
    clearInterval(this.timerRef);
    // if (Math.min(...this.dataSource.map((item) => item.result)) >= this.time) {
    //   this.newRecord = true;
    // }
  }

}
