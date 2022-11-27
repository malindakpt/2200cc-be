export enum Status {
    SUCCESS, ERROR
}

export type BEResponse = {
    data: any;
    error: any;
    status: Status
}