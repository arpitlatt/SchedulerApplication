import { phases } from "./phases.model";
export class event {
        public id: string;
        public resource: string;
        public start: string;
        public end: string;
        public text: string;
        public backColor: string;
        public phases: Array<phases>;

}

//export class event {
//    constructor(
//        public id: string,
//        public resource: string,
//        public start: string,
//        public end: string,
//        public text: string,
//        public backColor: string,
//        public phases: Array<phases>,
//    ) { }
    
//}


