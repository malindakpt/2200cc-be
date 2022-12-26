import { createVehicle, deleteVehicle, readVehicles, updateVehicle, readVehicle, searchVehicles, allVehicles } from "../controllers/vehicle.controller";
import { Application } from "express";
import { addCacheHeaders } from "../middlewares/cache.middleware";

export const setVehicleRoutes = (app: Application) => {
    app.post('/vehicle/delete/:id', [deleteVehicle]);
    app.post('/vehicle/update', [updateVehicle]);
    app.post('/vehicle/create', [createVehicle]);
    app.get('/vehicle/list', [addCacheHeaders, readVehicles]);
    app.get('/vehicle/all', [allVehicles]);
    app.get('/vehicle/search', [searchVehicles]);
    app.get('/vehicle/:id', [addCacheHeaders, readVehicle]);
}