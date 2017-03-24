import { Pipe, PipeTransform } from '@angular/core';
import {ReferencesPipe} from "./reference.pipe";

import * as CryptoJS from "crypto-js";

@Pipe({name: 'publication'})
export class PublicationPipe implements PipeTransform {
    transform(value: any): string {

        let refPipe:ReferencesPipe = new ReferencesPipe();

        var isFromIdeo = false;
        var tabContent = "";

        if(value.title.length == 0){
            return;
        }

        if(value.ideo_id == 0){
            return refPipe.transform(value.title);
        }

        isFromIdeo = true;
        let h:any = CryptoJS.SHA256("work" + value.ideo_id);
        let hash = h.toString(CryptoJS.enc.Hex);
        var url = 'http://experiments.alfehrest.org/public/alkindi/?id=work_' + hash.substr(0, 13);
        return `<a target='_blank' href='${url}'>${value.title}</a>`;
    }
}