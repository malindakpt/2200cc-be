import { NextFunction, Request, Response } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {

    console.log("\x1b[2m", `${new Date().toLocaleTimeString()}  request:  ${req.originalUrl}`);
    next();
}
  