import { Application } from "express";
import { createBrand, readBrands } from "../controllers/meta.controller";

export const setMetaRoutes = (app: Application) => {
    app.get('/meta/brand/list', [readBrands]);
    app.post('/meta/brand/create', [createBrand]);
    // app.get('/vehicle/:id', [addCacheHeaders, readVehicle]);
}