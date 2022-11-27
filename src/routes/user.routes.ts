import { Application } from "express";
import { getAllUsers, signUp, signIn, refreshToken, logout, sendResetCode, changePassword } from "../controllers/users.controller";

export const setUserRoutes = (app: Application) => {
    app.post('/user/signUp', [signUp]);
    app.post('/user/signIn', [signIn]);
    app.post('/user/refreshToken', [refreshToken]);
    app.post('/user/logout', [logout]);
    app.post('/user/sendResetCode', [sendResetCode]);
    app.post('/user/changePassword', [changePassword]);
    app.post('/user/all', [getAllUsers]);
    // app.post('/user/reset/email', [resetPassordToEmail]);
    // app.get('/users', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(PAID),
    //     UsersController.list
    // ]);
    // app.get('/users/:userId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    //     PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    //     UsersController.getById
    // ]);
    // app.patch('/users/:userId', [    
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    //     PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    //     UsersController.patchById
    // ]);
    // app.delete('/users/:userId', [
    //     ValidationMiddleware.validJWTNeeded,
    //     PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    //     UsersController.removeById
    // ]);
}