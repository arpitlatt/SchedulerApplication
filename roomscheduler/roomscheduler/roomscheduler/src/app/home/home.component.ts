import { Component, OnInit } from '@angular/core';

import { ModalService } from '../_services/index';

import { CreateComponent } from '../scheduler/create.component';

import {  ViewChild, Output, EventEmitter } from '@angular/core';
import { DayPilot } from "daypilot-pro-angular";
import Modal = DayPilot.Angular.Modal;
import { Validators, FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from "@angular/forms";
import { DataService, CreateEventParams } from "../scheduler/data.service";

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent  {
    private bodyText: string;
    @ViewChild("modal") modal: Modal;
    @Output() close = new EventEmitter();

    form: FormGroup;
    dateFormat = "MM/dd/yyyy h:mm tt";

    resources: any[];

    constructor(private fb: FormBuilder, private ds: DataService, private modalService: ModalService) {
        this.form = this.fb.group({
            name: ["", Validators.required],
            start: ["", this.dateTimeValidator(this.dateFormat)],
            end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
            resource: ["", Validators.required]
        });

        this.ds.getResources().subscribe(result => this.resources = result);
    }

    show(args: any) {
        args.name = "";
        this.form.setValue({
            start: args.start.toString(this.dateFormat),
            end: args.end.toString(this.dateFormat),
            name: "",
            resource: args.resource
        });
        this.modal.show();
    }

    submit() {
        let data = this.form.getRawValue();

        let params: CreateEventParams = {
            start: DayPilot.Date.parse(data.start, this.dateFormat).toString(),
            end: DayPilot.Date.parse(data.end, this.dateFormat).toString(),
            text: data.name,
            resource: data.resource
        };

        this.ds.createEvent(params).subscribe(result => {
            //params.id = result.id;
            this.modal.hide(result);
        });
    }

    cancel() {
        this.modal.hide();
    }

    closed(args) {
        this.close.emit(args);
    }

    dateTimeValidator(format: string) {
        return function (c: FormControl) {
            let valid = !!DayPilot.Date.parse(c.value, format);
            return valid ? null : { badDateTimeFormat: true };
        };
    }

    //constructor(private modalService: ModalService) {
    //}

    ngOnInit() {
        this.bodyText = 'This text can be updated in modal 1';
    }

    openModal(id: string){
        this.modalService.open(id);
    }

    closeModal(id: string){
        this.modalService.close(id);
    }
}
