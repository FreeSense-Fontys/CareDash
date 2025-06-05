import { Alert } from "./Alert";
import { Timing } from "./Timing";
import { VitalName } from "./Vital";

export interface Preset{
    id?:string;
    name:string;
    carepathId:string;
    
    
    vitals:VitalName[];
    timings:Timing[];
    alerts:Alert[];
}