import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {SchedulerModule} from "./scheduler/scheduler.module";

import { routing } from './app.routing';
import { HomeComponent } from './home/index';
import { TestPageComponent } from './test-page/index';
import { NgDatepickerModule } from 'ng2-datepicker';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
      AppComponent,
      TestPageComponent,
      HomeComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
      SchedulerModule,
      routing,
      ReactiveFormsModule,
      NgDatepickerModule,
      DateTimePickerModule,
      BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
