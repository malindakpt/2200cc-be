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

export const createAccessToken = (user: UserModel) => {
  const obj = {
    id: user.id,
    identifier: user.identifier,
    name: user.name,
    country: user.country,
    email: user.email,
    phone: user.phone,
  };
  const accessToken = sign(obj, config.accessTokenSecret, {
    expiresIn: config.accessTokenValidity,
  });
  return accessToken;
};

export const createRefreshToken = (user: UserModel) => {
  const obj = {
    id: user.id,
    identifier: user.identifier,
    name: user.name,
    country: user.country,
    email: user.email,
    phone: user.phone,
  };
  const accessToken = sign(obj, config.refreshTokenSecret, {
    expiresIn: config.refreshTokenValidity,
  });
  return accessToken;
};

export const setCookies = (foundUser: UserModel, res: Response) => {
  const accessToken = createAccessToken(foundUser.toJSON());
  const refreshToken = createRefreshToken(foundUser.toJSON());

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
