import { createRecord, deleteRecord, readRecords, updateRecord, readRecord, allRecords, searchRecords } from "../controllers/record.controller";
import { Application } from "express";
import { addCacheHeaders } from "../middlewares/cache.middleware";

export const setRecordRoutes = (app: Application) => {
    app.post('/record/delete/:id', [deleteRecord]);
    app.post('/record/update', [updateRecord]);
    app.post('/record/create', [createRecord]);
    app.get('/record/list', [readRecords]);
    app.get('/record/all', [allRecords]);
    app.get('/record/search', [searchRecords]);
    app.get('/record/:id', [readRecord]);
}