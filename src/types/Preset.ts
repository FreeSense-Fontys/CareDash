import { Alert } from "./Alert";
import { Timing } from "./Timing";
import { Vital } from "./Vital";

export interface Preset{
    id?:string;
    name:string;
    carepathId:string;
    
    
    measuredVitals:Vital[];
    timings:Timing[];
    alerts:Alert[];
}