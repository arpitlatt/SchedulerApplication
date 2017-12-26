import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import { DayPilot } from 'daypilot-pro-angular';
import { event } from './event.model';
import { resource } from './resource.model';
import { phases } from './phases.model';


@Injectable()
export class DataService {

  resources: any[] = [
    { name: "Resource 1", id: "R1"},
    { name: "Resource 2", id: "R2" },
    { name: "Resource 3", id: "R3" },
    { name: "Resource 4", id: "R4" },

    { name: "Resource 5", id: "R5" },
    { name: "Resource 6", id: "R6" },
    { name: "Resource 7", id: "R7" },
    { name: "Resource 8", id: "R8" }




  ];

  events: any[] = [
    {
      id: "1",
      resource: "R1",
      //11/20/2017 21: 0:0 "2017-11-20T9:0:0"
      start: "2017-11-07T15:15:00",
     end: "2017-11-07T17:45:00",
      //start: Date.now().toLocaleString(),
      //end: (Date.now()+1).toLocaleString(),
      text: "Event 1",
      backColor: "#cccccc",
      phases: [
          { start: "2017-11-07T15:00:00", end: "2017-11-07T15:15:00", text: "Preparation", toolTip: "Preparation", background: "#b6d7a8" },
          { start: "2017-11-07T15:15:00", end: "2017-11-07T17:45:00", text: "Main Phase", toolTip: "Main Phase", background: "#93c47d" },
      ]
    }
  ];
  private actionUrl: string;

  //apiUrl: string = "http://localhost:4200/api/books";// Web API URL  

  constructor(private http: Http) {
      this.actionUrl = "http://localhost:4200/api/books/";
  }

  getEvents(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString()).map((response:Response) => response.json());
  }
  
  getEmployeesevents() {
      return this.http.get(this.actionUrl)
          .map((response: Response) => {
              const data = response.json().obj;
              let objs: any[] = [];

              for (let i = 0; i < data.length; i++) {
                  var phsarray = new phases[2];
                  var phs = new phases();
                  phs.start = data[i].date + "T" + data[i].starttime;
                  phs.end = data[i].date + "T" + data[i].preparemins;
                  phs.background = "#b6d7a8";
                  phs.text = i.toString();
                  phs.toolTip = "preparetime";
                  phsarray[0] = phs;
                  var phss = new phases();
                  phss.start = data[i].date + "T" + data[i].preparemins;
                  phss.end = data[i].date + "T" + data[i].endtime;
                  phss.background = "#93c47d";
                  phss.text = i.toString();
                  phss.toolTip = "maintime";
                  phsarray[1] = phss;

                  var even = new event();
                      even.id = i.toString();
                  even.resource = data[i].roomid;
                  even.start = data[i].date + "T" + data[i].starttime;
                  even.end = data[i].date + "T" + data[i].endtime;
                  even.text = data[i].roomid;
                  even.backColor = "#cccccc";
                  even.phases = phsarray;
                  
                  let employeeven = even;
                  objs.push(employeeven)
              }
              return objs
          })
  }
  getEmployeesresource() {
      return this.http.get(this.actionUrl)
          .map((response: Response) => {
              const data = response.json().obj;
              let objs: any[] = [];

              for (let i = 0; i < data.length; i++) {
                 
                  var res = new resource();
                  res.name = data[i].roomname;
                  res.id = data[i].roomid;
                  

                  let employeeres = res;
                  objs.push(employeeres)
              }
              return objs
          })
  }



  getResources(): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.resources);
      }, 200);
    });


    //return this.http.get(this.actionUrl)
    //    .map((response: Response) => <any>response.json())
    //    .do(x => console.log(x));


    // return this.http.get("/api/resources").map((response:Response) => response.json());
  }

  createRoom(params: CreateRoomParams): Observable<RoomData> {
      return this.http.post("/api/backend_room_create.php", params).map((response: Response) => {
          return {
              name: params.name,
              capacity: params.capacity,
              status: "Ready",
              id: response.json().id,
          };
      });
  }

  updateRoom(params: UpdateRoomParams): Observable<RoomData> {
      return this.http.post("/api/backend_room_update.php", params).map((response: Response) => {
          return {
              id: params.id,
              name: params.name,
              capacity: params.capacity,
              status: params.status
          };
      });
  }

  deleteRoom(id: string): Observable<any> {
      return this.http.post("/api/backend_room_delete.php", { id: id }).map((response: Response) => response.json());
  }


  createEvent(data: CreateEventParams): Observable<EventData> {
      let e: EventData = {
          start: data.start,
          end: data.end,
          resource: data.resource,
          id: DayPilot.guid(),
          text: data.text
      };

      return Observable.of(e);
      //return this.http.post("/api/events/create", data).map((response:Response) => response.json());
  }

  updateEvent(data: DayPilot.Event): Observable<any> {
      console.log("Updating event: " + data.text());
      console.log(data);
      return Observable.of({ result: "OK" });
  }

  deleteEvent(data: DayPilot.Event): Observable<any> {
      //return this.http.post("/api/backend_room_delete.php", { id: id }).map((response: Response) => response.json());
      return Observable.of(data);

  }
  //deleteEvent(id: string): Observable<any> {
  //    //return this.http.post("/api/backend_room_delete.php", { id: id }).map((response: Response) => response.json());
  //    return Observable.of({ result: "OK" });

  //}


}


export interface CreateEventParams {
    start: string;
    end: string;
    text: string;
    resource: string | number;
}

export interface UpdateEventParams {
    id: string | number;
    start: string;
    end: string;
    text: string;
    resource: string | number;
}

export interface EventData {
    id: string | number;
    start: string;
    end: string;
    text: string;
    resource: string | number;
}

export interface RoomData {
    id: string;
    name: string;
    capacity: number;
    status: string;
}
export interface CreateRoomParams {
    name: string;
    capacity: number;
}

export interface UpdateRoomParams {
    id: string;
    name: string;
    capacity: number;
    status: string;
}

