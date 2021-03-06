import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ScraperService } from './scraper/scraper.service';
import { Configuration } from './app.configuration';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ScraperService,
    Configuration
    ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
