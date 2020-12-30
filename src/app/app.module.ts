import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { LanguageSwitchComponent } from './language-switch/language-switch.component';
import { MenuComponent } from './menu/menu.component';
import { ResultsComponent, ResetResultDialogComponent } from './results/results.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { ConvertBooleanPipe } from './shared/pipes/convert-boolean.pipe';
import { ConvertDifficultyPipe } from './shared/pipes/convert-difficulty.pipe';
import { TimeFormatPipe } from './shared/pipes/time-format.pipe';

const dbConfig: DBConfig  = {
  name: 'ReflexGameResults',
  version: 1,
  objectStoresMeta: [{
    store: 'results',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'position', keypath: 'position', options: { unique: true } },
      { name: 'firstName', keypath: 'name', options: { unique: false } },
      { name: 'result', keypath: 'result', options: { unique: false } }
    ]
  }]
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
    ConvertBooleanPipe,
    GameComponent,
    LanguageSwitchComponent,
    MenuComponent,
    TimeFormatPipe,
    ClickOutsideDirective,
    ConvertDifficultyPipe,
    ResetResultDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatDialogModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient],
      }
  })
  ],
  providers: [Title],
  bootstrap: [AppComponent],
  entryComponents: [ResetResultDialogComponent]
})
export class AppModule { }
