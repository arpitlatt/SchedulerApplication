
import {DataService} from "./data.service";
import {HttpModule} from "@angular/http";
import { FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {SchedulerComponent} from "./scheduler.component";

import { DayPilot } from "daypilot-pro-angular";

import { CreateComponent } from "./create.component";
import { EditComponent } from "./edit.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgDatepickerModule } from 'ng2-datepicker';
import { DateTimePickerModule } from 'ng-pick-datetime';
import { SidebarModule } from "../sidebar/sidebar.module";


import { ModalComponent } from '../_directives/index';
import { ModalService } from '../_services/index';


@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      SidebarModule,
      NgDatepickerModule,
      DateTimePickerModule
  ],
  declarations: [
      DayPilot.Angular.Scheduler,
      DayPilot.Angular.Modal,
      DayPilot.Angular.Navigator,

      SchedulerComponent,
      CreateComponent,
      EditComponent,
      ModalComponent,

  ],
  exports:      [ SchedulerComponent ],
  providers:    [ DataService , ModalService]
})
export class SchedulerModule { }
