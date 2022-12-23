import { config } from "../config";
import { NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalUrl = req.originalUrl.split('?')[0];
  if (
    originalUrl === "/" ||
    originalUrl === "/user/signIn" ||
    originalUrl === "/user/signUp" ||
    originalUrl === "/user/logout" ||
    originalUrl === "/user/refreshToken" ||
    originalUrl === "/user/sendResetCode" ||
    originalUrl === "/user/changePassword" ||
    originalUrl.endsWith(".js") ||
    originalUrl.endsWith(".css") ||
    originalUrl.endsWith(".jpg") ||
    originalUrl.endsWith(".json") ||
    originalUrl.endsWith(".ico")
  ) {
    return next();
  } else {
    const accessToken = req.cookies["access-token"];
    if (!accessToken)
      return res.status(403).json({ error: "User not Authenticated!" });

    try {
      const validToken = verify(accessToken, config.accessTokenSecret);
      if (validToken) {
        // @ts-ignore
        req.authenticated = true;
        return next();
      }
    } catch (err) {
      return res.status(403).json(err);
    }
  }
};
