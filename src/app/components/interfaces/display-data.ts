
export class DisplayData {
    title:string;
    subtitle:string;
    shareLink:string;
    sections:DisplaySection[] = [];
}

export class DisplaySection {
    title:string;
    type:string;
    cls:string;
    subtitle:string;
    content:any = null;
}