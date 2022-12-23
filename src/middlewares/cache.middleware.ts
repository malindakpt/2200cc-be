import { NextFunction, Request, Response } from "express";

export const addCacheHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.set('Cache-control', 'private, max-age=300');
  return next();
};
