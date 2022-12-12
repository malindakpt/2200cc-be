import { sign, verify } from "jsonwebtoken";
import { User, UserModel } from "../models/user.model";
import dotenv from "dotenv";
import { config } from "../config";
import { Response, Request } from "express";

dotenv.config();

export const generateRandomCode = (length: number) => {
  return Math.round(Math.random() * Math.pow(10, length));
};

export const getFutureTime = (date: number, periodMinutes: number) => {
  return date + periodMinutes * 60 * 1000;
};

export const removeSensitiveData = (user: UserModel) => {
  const obj: any = user.toJSON();

  delete obj.refreshToken;
  delete obj.password;
  return obj;
};

export const createAccessToken = (data: any) => {
  const accessToken = sign(data, config.accessTokenSecret, {
    expiresIn: config.accessTokenValidity,
  });
  return accessToken;
};

export const createRefreshToken = (data: any) => {
  const accessToken = sign(data, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenValidity,
  });
  return accessToken;
};

export const setCookies = (data: any, res: Response) => {
  const accessToken = createAccessToken(data);
  const refreshToken = createRefreshToken(data);

  res.cookie("user-token", accessToken, {
    maxAge: config.refreshTokenValidity * 1000,
    sameSite: "none",
    secure: true
  });
  res.cookie("access-token", accessToken, {
    maxAge: config.accessTokenValidity * 1000,
    sameSite: "none",
    secure: true
  });
  res.cookie("refresh-token", refreshToken, {
    maxAge: config.refreshTokenValidity * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true
  });

  return { accessToken, refreshToken };
};

export const clearAllCookies = (res: Response) => {
  res.clearCookie("user-token");
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");
};

export const getUser = (req: Request) => {
  try{
    const accessToken = req.cookies["access-token"];
    const decodedUser = verify(
      accessToken,
      config.accessTokenSecret
    ) as User;
    return decodedUser;
  } catch (e: any) {
    return null;
  }
}
