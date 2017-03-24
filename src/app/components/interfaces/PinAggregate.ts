import {Model} from "../../models/model";
export class PinAggregate {

    public static fromModelArray(models:Model[]) : PinAggregate[] {
        let hashmap = {};
        for(let m of models) {
            let locId = m.center.latitude + "_" + m.center.longitude;
            if(!(locId in hashmap)) {
                hashmap[locId] = new PinAggregate();
                hashmap[locId].name = m.center.name;
                hashmap[locId].longitude = m.center.longitude;
                hashmap[locId].latitude = m.center.latitude;
            }
            hashmap[locId].typeHashmap[m.entityType] = true;
            hashmap[locId].pins.push(m);
        }

        let ret = [];
        for(let idx in hashmap){
            hashmap[idx].types = Object.keys(hashmap[idx].typeHashmap);
            ret.push(hashmap[idx]);
        }
        return ret;
    }

    latitude:number = 0;
    longitude:number = 0;
    title:string = "";
    pins:Model[] = [];
    types:string[] = [];

    private typeHashmap:any = {}
}