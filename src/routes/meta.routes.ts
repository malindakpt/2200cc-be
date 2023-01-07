import { Application } from "express";
import { createBrand, readBrands } from "../controllers/meta.controller";

export const setMetaRoutes = (app: Application) => {
    app.get('/meta/brands/list', [readBrands]);
    app.get('/meta/brands/create', [createBrand]);
    // app.get('/vehicle/:id', [addCacheHeaders, readVehicle]);
}