import { Application } from "express";
import { signUp, signIn, refreshToken, logout, sendResetCode, changePassword, loggedInUser, allUsers, updateUser } from "../controllers/users.controller";
import { addCacheHeaders } from "../middlewares/cache.middleware";

export const setUserRoutes = (app: Application) => {
    app.post('/user/signUp', [signUp]);
    app.post('/user/signIn', [signIn]);
    app.post('/user/update', [updateUser]);
    app.get('/user/refreshToken', [refreshToken]);
    app.get('/user/loggedInUser', [addCacheHeaders, loggedInUser]);
    app.post('/user/logout', [logout]);
    app.post('/user/all', [allUsers]);
    app.post('/user/sendResetCode', [sendResetCode]);
    app.post('/user/changePassword', [changePassword]);
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