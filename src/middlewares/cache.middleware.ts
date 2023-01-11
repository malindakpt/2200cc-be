import { NextFunction, Request, Response } from "express";
import { config } from "../config";

export const addCacheHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.set('Cache-control', `private, max-age=${config.cacheTimeout}`);
  return next();
};
