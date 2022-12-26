import { createRecord, deleteRecord, readRecords, updateRecord, readRecord, allRecords, searchRecords } from "../controllers/record.controller";
import { Application } from "express";
import { addCacheHeaders } from "../middlewares/cache.middleware";

export const setRecordRoutes = (app: Application) => {
    app.post('/record/delete/:id', [deleteRecord]);
    app.post('/record/update', [updateRecord]);
    app.post('/record/create', [createRecord]);
    app.get('/record/list', [addCacheHeaders, readRecords]);
    app.get('/record/all', [addCacheHeaders, allRecords]);
    app.get('/record/search', [addCacheHeaders, searchRecords]);
    app.get('/record/:id', [addCacheHeaders, readRecord]);
}