import { createVehicle, deleteVehicle, readVehicles, updateVehicle, readVehicle, searchVehicles, allVehicles } from "../controllers/vehicle.controller";
import { Application } from "express";
import { addCacheHeaders } from "../middlewares/cache.middleware";

export const setVehicleRoutes = (app: Application) => {
    app.post('/vehicle/delete/:id', [deleteVehicle]);
    app.post('/vehicle/update', [updateVehicle]);
    app.post('/vehicle/create', [createVehicle]);
    app.get('/vehicle/list', [readVehicles, addCacheHeaders]);
    app.get('/vehicle/all', [allVehicles, addCacheHeaders]);
    app.get('/vehicle/search', [searchVehicles, addCacheHeaders]);
    app.get('/vehicle/:id', [readVehicle, addCacheHeaders]);
}