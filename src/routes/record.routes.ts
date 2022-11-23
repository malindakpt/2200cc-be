import { createRecord, deleteRecord, readRecords, updateRecord, readRecord } from "controllers/record.controller";
import { Application } from "express";

export const setRecordRoutes = (app: Application) => {
    app.post('/record/delete/:id', [deleteRecord]);
    app.post('/record/update', [updateRecord]);
    app.post('/record/create', [createRecord]);
    app.post('/record/list', [readRecords]);
    app.post('/record/:id', [readRecord]);
}