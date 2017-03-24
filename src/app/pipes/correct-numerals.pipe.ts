import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'references'})
export class ReferencesPipe implements PipeTransform {
    transform(value: string): string {

        let result:string = "";
        let ref = value.trim();
        if(ref.length == 0) {
            return result;
        }
        let isLink = ref.toLowerCase().indexOf("http") == 0;
        if(!isLink) {
            if(ref.length > 200) {
                result += ref.substr(0, 200) + "&hellip;";
            } else {
                result += ref;
            }
        } else {
            result += `<a target="_blank" href="${ref}">`;
            if(ref.length > 60) {
                result += (ref.substr(0, 60) + "&hellip;");
            } else {
                result += ref;
            }
            result += "</a>";
        }

        return result;
    }
}