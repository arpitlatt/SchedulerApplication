import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer } from "@angular/core";
import { DayPilot } from "daypilot-pro-angular";
import { DataService } from "./data.service";
import { DatePipe } from '@angular/common';
import { CreateComponent } from "./create.component";
import { EditComponent } from "./edit.component";
import { Output, EventEmitter } from '@angular/core';
import Modal = DayPilot.Angular.Modal;
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, FormArray } from "@angular/forms";
import { CreateEventParams } from "./data.service";
import { OnInit } from '@angular/core';
import { ModalService } from '../_services/index';
import { DatepickerOptions } from 'ng2-datepicker';
//import '../sass/main.scss';
import '../../sass/main.scss';

@Component({
    selector: 'scheduler-component',
    template: ` 
  <!--<strong>HEADER</strong>-->
  <modal id="custom-modal-3">
    <div class="modal">
      <div class="modal-body">
        <div class="center">
          <h1>Create Event</h1>
          <form [formGroup]="form">
 <div class="form-item" style="padding:5px;">


<div *ngFor="let skill of skills.controls; let i=index">
   <input type="checkbox" [formControl]="skill"  />
{{user.skills[i].name}}
  </div>
</div>

            <div class="form-item" style="padding:5px;">
              <input formControlName="name" type="text" placeholder="Event Name"> <span *ngIf="!form.controls.name.valid">Event name required</span>
            </div>
            <div class="form-item" style="padding:5px;">
              <select formControlName="resource">
                <option *ngFor="let r of resources" [ngValue]="r.id">{{r.name}}</option>
              </select>
            </div>
            <div class="form-item" style="padding:5px;">
<span>startDate</span>
<owl-date-time formControlName="start"
                                   [dateFormat]="'YYYY-MM-DD'"
                                   [type]="'calendar'" [placeHolder]="'yyyy/mm/dd'"
                                   [inputId]="'input2'"></owl-date-time>
            </div>
            <div class="form-item" style="padding:5px;">
<span>endDate</span>

<owl-date-time formControlName="end"
                                   [dateFormat]="'YYYY-MM-DD'"
                                   [type]="'calendar'" [placeHolder]="'yyyy/mm/dd'"
                                   [inputId]="'input3'"></owl-date-time>

            </div>
 <div class="form-item" style="padding:5px;">
<span>startTime</span>
 
<owl-date-time formControlName="input3Moment" [type]="'timer'"
                                   [dateFormat]="'hh:mma'"
                                   [placeHolder]="'hh:mma'" [inputId]="'input4'"></owl-date-time>

            </div>
            <div class="form-item" style="padding:5px;">
<span>endTime</span>
 
<owl-date-time formControlName="input4Moment" [type]="'timer'"
                                   [dateFormat]="'hh:mma'"
                                   [placeHolder]="'hh:mma'" [inputId]="'input5'"></owl-date-time>


            </div>
            <div class="form-item" style="padding:5px;">
              <button (click)="submit(form.value)" [disabled]="!form.valid">Create</button>
              <button (click)="cancel()">Cancel</button>
            </div>
          </form>
        </div>
        <button (click)="closeModal('custom-modal-3');">Close</button>
      </div>
    </div>
    <div class="modal-background"></div>
  </modal>
  <modal id="custom-modal-4">
    <div class="modal">
      <div class="modal-body">
        <div class="center">
          <h1>Update Event</h1>
          <form [formGroup]="form">
            <div class="form-item">
              <input formControlName="name" type="text" placeholder="Event Name"> <span *ngIf="!form.controls.name.valid">Event name required</span>
            </div>
            <div class="form-item">
              <select formControlName="resource">
                <option *ngFor="let r of resources" [ngValue]="r.id">{{r.name}}</option>
              </select>
            </div>
            <div class="form-item">
              <input formControlName="start" type="text" placeholder="Start"> <span *ngIf="!form.controls.start.valid">Invalid datetime</span>
            </div>
            <div class="form-item">
              <input formControlName="end" type="text" placeholder="End"> <span *ngIf="!form.controls.end.valid">Invalid datetime</span>
            </div>
            <div class="form-item">
              <button (click)="submitedit()" [disabled]="!form.valid">Create</button>
              <button (click)="cancel()">Cancel</button>
            </div>
          </form>
        </div>

          <button (click)="closeModal('custom-modal-4');">Close</button>
        </div>
      </div>
        <div class="modal-background"></div>
  </modal>

<div class="column-left">


          <daypilot-navigator [config]="navigatorConfig" (dateChange)="dateChange()" #navigator></daypilot-navigator>
  </div>
  <div class="column-main">
          <daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>
  </div>
 <create-dialog #create (close)="createClosed($event)"></create-dialog>

          <edit-dialog #edit (close)="editClosed($event)"></edit-dialog>`,
    styles: [`
  .column-left {
    width: 290px;
    float: left;
  }
  
  .column-main {
    margin-left: 160px;
  }
  `]
})

    //<ng-datepicker formControlName="date" [options]="options"></ng-datepicker>
export class SchedulerComponent implements AfterViewInit {

    @ViewChild("scheduler") scheduler: DayPilot.Angular.Scheduler;
    @ViewChild("create") create: CreateComponent;
    @ViewChild("edit") edit: EditComponent;
    @ViewChild("navigator") navigator: DayPilot.Angular.Navigator;
    @ViewChild("modal") modal: Modal;

    user = {
        skills: [
            { name: 'Sunday', selected: false, id: 1 },
            { name: 'Monday', selected: false, id: 2 },
            { name: 'Tuesday', selected: false, id: 3 },
            { name: 'Wednesday', selected: false, id: 4 },
            { name: 'Thrusday', selected: false, id: 5 },
            { name: 'Friday', selected: false, id: 6 },
            { name: 'Saturday', selected: false, id: 7 },
        ]
    }

    options: DatepickerOptions = {
        minYear: 1970,
        maxYear: 2030,
        displayFormat: 'YYYY-MM-DD',
        // barTitleFormat: 'MMMM YYYY',
        firstCalendarDay: 0 // 0 - Sunday, 1 - Monday
    };
    date: Date;

    expanded: boolean = true;

    heightModes: any[] = [
        { name: "Fixed 100%", value: "Parent100Pct" },
        { name: "Max 100%", value: "Max100Pct" },
    ];

    navigatorConfig: any = {

        selectMode: "Day",
        startDate: new Date(),
        selectionDay: new Date()
    };

    myDates = new Date();

    counterValue = 0;

    getTimeline(date?: DayPilot.Date | string): any[] {
        var date = date || this.navigator.control.selectionDay;
        var start = new DayPilot.Date(date).firstDayOfMonth();
        var days = start.daysInMonth();

        var timeline = [];

        var checkin = 12;
        var checkout = 12;

        for (var i = 0; i < days; i++) {
            var day = start.addDays(i);
            timeline.push({ start: day.addHours(checkin), end: day.addDays(1).addHours(checkout) });
        }

        return timeline;
    };

    Layout: "DivBased";
    events: any[] = [];
    startDate: Date;

    menu: DayPilot.Menu = new DayPilot.Menu({
        items: [
            {
                text: "Delete", onClick: args => {
                    let row = args.source;
                    this.ds.deleteEvent(row).subscribe(result => {
                        if (result) {
                            var i = this.events.indexOf(result);
                            if (i != -1) {
                                this.events.splice(i, 1);
                            }
                            this.events.pop();
                            //this.scheduler.control.message("Created.");
                            //this.scheduler.control.clearSelection();

                        }
                        row.remove();
                        this.scheduler.control.message("Deleted");
                    });
                }
            },
            
        ]
    });

    config: any = {
        contextMenu: this.menu,
        timeHeaders: [
            { groupBy: "Day", format: "dddd, MMMM dd, yyyy" },
            { groupBy: "Hour", height: 30 },
            { groupBy: "Hour" },
            { groupBy: "Hour" },

        ],
        layout: 'DivBased',
        hourWidth: 130,

        eventHeight: 40,

        days: 31,

        businessBeginsHour: 7,

        businessEndsHour: 22,

        showNonBusiness: false,

        cellWidth: 85,
        onEventClicked: args => {
            this.showedit(args.e);
        },

       
        onTimeRangeSelected: args => {
            this.show(args);
        },

    
        //onBeforeEventRender: args => {
        //    args.e.areas = [{
        //        "action": "JavaScript", "js": "(function(e) { dp.events.remove(e); })", "bottom": 9, "w": 17, "v": "Hover", "css": "event_action_delete", "top": 3, "righ t": 2
        //    }];
 
        //},
        onBeforeTimeHeaderRender: args => {

            let component = this;

            if (args.header.level === 1) {

                if (args.header.html == "7 AM") {

                    args.header.html = "-Year";
                }
                else if (args.header.html == "8 AM") {

                    args.header.html = "-Year";
                }
                else if (args.header.html == "9 AM") {

                    args.header.html = "-Year";
                }
                else if (args.header.html == "10 AM") {

                    args.header.html = "-Month";
                }
                else if (args.header.html == "11 AM") {

                    args.header.html = "-Week";
                }
                else if (args.header.html == "12 PM") {

                    args.header.html = "-Day";
                }
                else if (args.header.html == "1 PM") {

                    args.header.html = "Yesterday";
                }
                else if (args.header.html == "2 PM") {

                    args.header.html = "Today";
                }
                else if (args.header.html == "3 PM") {

                    args.header.html = "Tomorrow";
                }
                else if (args.header.html == "4 PM") {

                    args.header.html = "+Day";
                }
                else if (args.header.html == "5 PM") {

                    args.header.html = "+Week";
                }
                else if (args.header.html == "6 PM") {

                    args.header.html = "+Month";
                }
                else if (args.header.html == "7 PM") {

                    args.header.html = "+Year";
                }
                else if (args.header.html == "8 PM") {

                    args.header.html = "+Year";
                }
                else if (args.header.html == "9 PM") {

                    args.header.html = "+Year";
                }
            }
            if (args.header.level === 2) {

                var myDate = this.myDates;
                var previousDayL = new Date(new Date());

                previousDayL.setDate(new Date().getDate() - 1);
                var nextDayL = new Date(new Date());

                nextDayL.setDate(new Date().getDate() + 1);

                var previousDay = new Date(myDate);

                previousDay.setDate(myDate.getDate() - 1);
                var previousMonth = new Date(myDate);

                previousMonth.setMonth(myDate.getMonth() - 1);
                var previousYear = new Date(myDate);

                previousYear.setFullYear(myDate.getFullYear() - 1);
                var previousDay7 = new Date(myDate);

                previousDay7.setDate(myDate.getDate() - 7);
                var nextDay = new Date(myDate);

                nextDay.setDate(myDate.getDate() + 1);
                var nextMonth = new Date(myDate);

                nextMonth.setMonth(myDate.getMonth() + 1);
                var nextYear = new Date(myDate);

                nextYear.setFullYear(myDate.getFullYear() + 1);
                var nextDay7 = new Date(myDate);

                nextDay7.setDate(myDate.getDate() + 7);

                if (args.header.html == "7 AM" || args.header.html == "7") {
                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousYear.toLocaleDateString() + "' width='15' height='15' /> ";

                    //args.header.html = "<input type='button' class = 'btns' value='" + previousYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "8 AM" || args.header.html == "8") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "9 AM" || args.header.html == "9") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "10 AM" || args.header.html == "10") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousMonth.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "11 AM" || args.header.html == "11") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousDay7.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "12 PM" || args.header.html == "12") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousDay.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "1 PM" || args.header.html == "1") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + previousDayL.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "2 PM" || args.header.html == "2") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + new Date().toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "3 PM" || args.header.html == "3") {
                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextDayL.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "4 PM" || args.header.html == "4") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextDay.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "5 PM" || args.header.html == "5") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextDay7.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "6 PM" || args.header.html == "6") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextMonth.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "7 PM" || args.header.html == "7") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "8 PM" || args.header.html == "8") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
                else if (args.header.html == "9 PM" || args.header.html == "9") {

                    args.header.html = "<input type='button' (click)='navigate()' class = 'btns' value='" + nextYear.toLocaleDateString() + "' width='15' height='15' /> ";
                }
            }

        },

        //onBeforeEventRender: args => {
        //    if (args.data.phases) {

        //        // hide the default event content and tooltip
        //        args.data.barHidden = true;
        //        args.data.html = '';
        //        args.data.toolTip = '';

        //        if (!args.data.areas) {
        //            args.data.areas = [];
        //        }
        //        args.data.phases.forEach(phase => {
        //            args.data.areas.push({
        //                start: phase.start,
        //                end: phase.end,
        //                top: 0,
        //                bottom: 0,
        //                css: phase.css,
        //                style: "overflow:hidden; padding: 3px; box-sizing: border-box;",
        //                background: phase.background,
        //                html: phase.text,
        //                toolTip: phase.toolTip
        //            });
        //        });
        //    }
        //}


    };

    @Output() close = new EventEmitter();

    form: FormGroup;
    dateFormat = "MM/dd/yyyy h:mm tt";
    dateFormats = "YYYY-MM-dd";
    resources: any[];
    eventedit: DayPilot.Event;
    //date2 = new Date("Thu Jan 01 2015 13:55:24 GMT-0500 (EST)");
    //gmtDate = '2015-01-01T00:00:00.000Z';
    //myVar = '2015-01-01';


    public moment: Date = new Date();

    public min = new Date(2017, 7, 9);
    public max = new Date(2017, 8, 10);
    public disabledDates = [new Date(2017, 7, 9),
    new Date(2017, 7, 12), new Date(2017, 7, 15), new Date(2017, 7, 20)];

    public pickerColor: string = '#0070ba';

    public es = {
        firstDayOfWeek: 1,
        dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
        dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
        monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
    };

    public input1Moment: any;
    public input2Moment: any;
    public input3Moment: any;
    public input4Moment: any;



    constructor(private fb: FormBuilder, private ds: DataService, private cdr: ChangeDetectorRef, private elRef: ElementRef, private renderer: Renderer, private modalService: ModalService) {
        //  this.myDates = new Date();
        this.date = new Date();

        this.form = this.fb.group({
            name: ["", Validators.required],
            //start: ["", this.dateTimeValidator(this.dateFormat)],
            //end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
            start: ["", Validators.required],
            end: ["", Validators.required],
            resource: ["", Validators.required],
            skills: this.buildSkills(),
            date: new Date(),
            input2Moment: new Date(),
            input3Moment: null,
            input4Moment: null

            //date2: [null, [Validators.required]],


        });
        console.log(this.form.get("skills"))

        this.ds.getResources().subscribe(result => this.resources = result);
    }

    get skills(): FormArray {
        return this.form.get('skills') as FormArray;
    };


    buildSkills() {
        const arr = this.user.skills.map(skill => {
            return this.fb.control(skill.selected);
        });
        return this.fb.array(arr);
    }

    show(args: any) {
        args.name = "";
        const arr = this.user.skills.map(skill => {
            return this.fb.control(skill.selected);
        });
        this.form.patchValue({
            start: new Date(args.start.value),
            end: new Date(args.end.value),
            name: "",
            resource: args.resource,
            input2Moment: new Date(args.start.value),
            input3Moment: new Date(args.start.value),
            input4Moment: new Date(args.end.value),
            //input3Moment: new Date(args.start.value).getHours().toString() + ":" + new Date(args.start.value).getMinutes().toString()
            //skills: this.user.skills.map(s => {
            //    this.fb.group({
            //        selected: [false],
            //        id: [s.id]
            //    });
            //})
           // skills: (arr)
        });
        // this.form.setControl('skills', this.fb.array(this.user.skills || []));

        this.modalService.open('custom-modal-3');
    }

    showedit(ev: DayPilot.Event) {
        this.eventedit = ev;
        this.form.patchValue({
            start: ev.start().toString(this.dateFormat),
            end: ev.end().toString(this.dateFormat),
            name: ev.text(),
            resource: ev.resource()
        });
        this.modalService.open('custom-modal-4');
    }

    calcBusinessDays(dDate1, dDate2, dayNumber) {
        var dates = [];

        if (dDate1 > dDate2) return dates;
        var date = dDate1;

        while (date < dDate2) {
            //if (date.getDay() === 0 || date.getDay() === 6) dates.push(new Date(date));
            if (date.getDay() === dayNumber) dates.push(new Date(date));

            date.setDate(date.getDate() + 1);
        }

        return dates;
    }
    pad2(number) {

        return (number < 10 ? '0' : '') + number

    }
    submit(value) {
        let data = this.form.getRawValue();
        const f = Object.assign({}, value, {
            skills: value.skills.map((s, i) => {
                return {
                    id: this.user.skills[i].id,
                    selected: s
                }
            })
        });
        //let params: CreateEventParams = {
        //    start: new Date(data.start).toISOString(),
        //    end: new Date(data.end).toISOString(),
        //    text: data.name,
        //    resource: data.resource
        //};
        var counter = 0;
        for (var j = 0; j < f.skills.length; j++) {
            //  for (var i = 0; i < 1; i++) {
            if (f.skills[j].selected) {
                counter++;
                var sDate = new Date(data.start).toLocaleString();

                var sTime = parseInt(new Date(data.start).toLocaleTimeString());
                var shr = new Date(data.start).getHours();
                var smm = new Date(data.start).getMinutes();
                var sss = new Date(data.start).getSeconds();
                var eDate = new Date(data.end).toLocaleString();
                var eTime = parseInt(new Date(data.end).toLocaleTimeString());
                var ehr = new Date(data.end).getHours();
                var emm = new Date(data.end).getMinutes();
                var ess = new Date(data.end).getSeconds();
                var stDate = new Date(data.start).toISOString();
                var enDate = new Date(data.end).toISOString();
                var dates = this.calcBusinessDays(new Date(sDate), new Date(eDate),j);

                for (var i = 0; i < dates.length; i++) {
                    var fSdate = dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate();//prints expected format.
                    var fEdate = dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate();//prints expected format.

                    let paramslocal: CreateEventParams = {
                        start: dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate() + 'T' + ("0" + shr).slice(-2) + ':' + ("0" + smm).slice(-2) + ':' + ("0" + sss).slice(-2),
                        end: dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate() + 'T' + ("0" + ehr).slice(-2) + ':' + ("0" + emm).slice(-2) + ':' + ("0" + ess).slice(-2),
                        text: data.name,
                        resource: data.resource
                    };
                    this.ds.createEvent(paramslocal).subscribe(result => {
                        if (result) {
                            this.events.push(result);
                            //this.scheduler.control.message("Created.");
                           //this.scheduler.control.clearSelection();

                        }

                    });
                }
            }
        }

        if (counter == 0) {
            var sDate = new Date(data.start).toLocaleString();

            var sTime = parseInt(new Date(data.start).toLocaleTimeString());
            var shr = new Date(data.start).getHours();
            var smm = new Date(data.start).getMinutes();
            var sss = new Date(data.start).getSeconds();
            var eDate = new Date(data.end).toLocaleString();
            var eTime = parseInt(new Date(data.end).toLocaleTimeString());
            var ehr = new Date(data.end).getHours();
            var emm = new Date(data.end).getMinutes();
            var ess = new Date(data.end).getSeconds();
            var stDate = new Date(data.start).toISOString();
            var enDate = new Date(data.end).toISOString();
           // var dates = this.calcBusinessDays(new Date(sDate), new Date(eDate));
            var fstDate = new Date(sDate);
            var fenDate = new Date(eDate);
            let paramslocal: CreateEventParams = {
                start: fstDate.getFullYear() + '-' + (fstDate.getMonth() + 1) + '-' + fstDate.getDate() + 'T' + ("0" + shr).slice(-2) + ':' + ("0" + smm).slice(-2) + ':' + ("0" + sss).slice(-2),
                end: fenDate.getFullYear() + '-' + (fenDate.getMonth() + 1) + '-' + fenDate.getDate() + 'T' + ("0" + ehr).slice(-2) + ':' + ("0" + emm).slice(-2) + ':' + ("0" + ess).slice(-2),
                text: data.name,
                resource: data.resource
            };
            this.ds.createEvent(paramslocal).subscribe(result => {
                if (result) {
                    this.events.push(result);
                    this.scheduler.control.message("Created.");
                }

            });
            //for (var i = 0; i < dates.length; i++) {
            //    var fSdate = dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate();//prints expected format.
            //    var fEdate = dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate();//prints expected format.

            //    let paramslocal: CreateEventParams = {
            //        start: dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate() + 'T' + ("0" + shr).slice(-2) + ':' + ("0" + smm).slice(-2) + ':' + ("0" + sss).slice(-2),
            //        end: dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate() + 'T' + ("0" + ehr).slice(-2) + ':' + ("0" + emm).slice(-2) + ':' + ("0" + ess).slice(-2),
            //        text: data.name,
            //        resource: data.resource
            //    };
            //    this.ds.createEvent(paramslocal).subscribe(result => {
            //        if (result) {
            //            this.events.push(result);
            //            this.scheduler.control.message("Created.");
            //        }

            //    });
            //}
        }
        this.modalService.close('custom-modal-3');

        //if (counter == 0) {
        //    //this.ds.createEvent(params).subscribe(result => {
        //    //    if (result) {
        //    //        this.events.push(result);
        //    //        this.scheduler.control.message("Created.");
        //    //    }
        //    //    this.scheduler.control.clearSelection();

        //    //    this.modalService.close('custom-modal-3');
        //    //});
        //}
        
        console.log(f);
    }
    cancelDelete() {
        let data = this.form.getRawValue();

        // modify the original object from [events] which is stored in event.data
        this.eventedit.data.start = DayPilot.Date.parse(data.start, this.dateFormat);
        this.eventedit.data.end = DayPilot.Date.parse(data.end, this.dateFormat);
        this.eventedit.data.resource = data.resource;
        this.eventedit.data.text = data.name;

        this.ds.deleteEvent(this.eventedit).subscribe(result => {
            if (result) {
                var i = this.events.indexOf(result);
                if (i != -1) {
                    this.events.splice(i, 1);
                }
                // this.events.push(result);
                this.scheduler.control.message("Deleted");
            }
        });
        this.scheduler.control.clearSelection();

        this.modalService.close('custom-modal-4');
    }

    
    submitedit() {
        let data = this.form.getRawValue();

        // modify the original object from [events] which is stored in event.data
        this.eventedit.data.start = DayPilot.Date.parse(data.start, this.dateFormat);
        this.eventedit.data.end = DayPilot.Date.parse(data.end, this.dateFormat);
        this.eventedit.data.resource = data.resource;
        this.eventedit.data.text = data.name;

        this.ds.updateEvent(this.eventedit).subscribe(result => {
            if (result) {
                // this.events.push(result);
                this.scheduler.control.message("Updated");
            }
        });
        this.scheduler.control.clearSelection();

        this.modalService.close('custom-modal-4');
    }

    cancel() {
        this.modalService.close('custom-modal-3');
        console.log('cancel');

    }
    

    dateTimeValidator(format: string) {
        return function (c: FormControl) {
            let valid = !!DayPilot.Date.parse(c.value, format);
            return valid ? null : { badDateTimeFormat: true };
        };
    }
    openModal(id: string) {
        this.modalService.open(id);
    }


    dateChange() {

        this.config.startDate = this.navigator.control.selectionStart;
        var val = this.navigator.control.selectionStart;
        var dp = this.scheduler.control;
        this.myDates = val.toDateLocal();
        this.startDate = this.myDates;
        this.config.startDate = this.myDates;
        console.log(this.myDates);
        // dp.update();
        this.cdr.detectChanges();
    }
    createClosed(args) {
        if (args.result) {
            this.events.push(args.result);
            this.scheduler.control.message("Created.");
        }
        this.scheduler.control.clearSelection();
        console.log('created');

    }
    editClosed(args) {
        if (args.result) {
            this.scheduler.control.message("Updated");
        }
    }
    navigate(evnt) {
        console.log("eeeehnnananaa");
    }
    decrement() {
        this.counterValue = this.counterValue + 1;

    }
    createRoom() {
        this.modalService.open('custom-modal-3');

    }
    closeModal(id: string) {
        this.modalService.close(id);
        console.log('closeModal');

    }
    itemClick(event) {
        if (event.target.type === "button" && event.target.className === "btns") {
            var val = event.target.value;
            var dp = this.scheduler.control;
            this.myDates = new Date(val);
            this.startDate = this.myDates;
            this.config.startDate = this.myDates;
            console.log(this.myDates);
            // dp.update();
            this.cdr.detectChanges();

        }
    }

    ngAfterViewInit(): void {
        this.myDates = new Date();
        var from = this.scheduler.control.visibleStart();
        var to = this.scheduler.control.visibleEnd();

        this.renderer.listen(this.elRef.nativeElement, 'click', this.itemClick.bind(this));



        this.ds.getResources().subscribe(result => this.config.resources = result);


        this.ds.getEvents().subscribe(result => {
            this.events = result;

            this.cdr.detectChanges();
        });
    }

}

