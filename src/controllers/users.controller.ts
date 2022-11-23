import { Request, Response } from "express";
import { User, UserModel } from "models/user.model";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken, setCookies } from "util/helper";
import { verify } from "jsonwebtoken";
import { config } from "config";
import { sendEmail } from "../services/mail.service";
import { clearAllCookies } from "util/helper";

const resetPasswordCodes: any = {};

export const signUp = async (req: Request, res: Response) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;
    const user = await UserModel.create(req.body);

    const accessToken = createAccessToken(user.toJSON());
    const refreshToken = createRefreshToken(user.toJSON());

    res.cookie("access-token", accessToken, {
      maxAge: config.accessTokenValidity * 1000,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: config.refreshTokenValidity * 1000,
      httpOnly: true,
    });

    const responseData = {
      name: user.name,
      country: user.country,
      email: user.email,
      phone: user.phone,
    };

    return res.status(201).send(responseData);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const foundUser = await UserModel.findOne({
      where: { identifier },
    });

    if (!foundUser) {
      return res.status(401).send("User not found");
    }
    const passwordMatched = await bcrypt.compare(password, foundUser.password);

    if (!passwordMatched) {
      return res.status(401).send("Invalid password");
    }
    const refreshToken = setCookies(foundUser, res);
    await foundUser.update({ refreshToken });

    return res.status(200).send(foundUser);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const resRefreshToken = req.cookies["refresh-token"];

    const foundUser = await UserModel.findOne({
      where: { refreshToken: resRefreshToken },
    });

    // refresh-token reuse or hacked
    // TODO: invalidate other sessions
    if (!foundUser) {
      return res.status(401).send("User not found");
    }
    const decodedUser = verify(
      resRefreshToken,
      config.refreshTokenSecret
    ) as User;

    if (decodedUser.name !== foundUser.name) {
      return res.status(401).send("Token ownership validation failed");
    }

    const refreshToken = setCookies(foundUser, res);
    await foundUser.update({ refreshToken });
    return res.status(200).send(foundUser);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const resRefreshToken = req.cookies["refresh-token"];
    const decodedUser = verify(
      resRefreshToken,
      config.refreshTokenSecret
    ) as User;

    const foundUser = await UserModel.findOne({
      where: { id: decodedUser.id },
    });

    if (!foundUser) {
      return res.status(500).send("User not found");
    }
    await foundUser.update({ refreshToken: "" });

    clearAllCookies(res);
    return res.status(200).send("Successfully logged out");
  } catch (e: any) {
    clearAllCookies(res);
    return res.status(200).send(e.message);
  }
};

export const sendResetCode = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;

    const foundUser = await UserModel.findOne({
      where: { identifier },
    });

    if (!foundUser) {
      return res.status(500).send("User does not exist");
    }

    const randomCode = Math.round(Math.random() * Math.pow(10, 6));
    resetPasswordCodes[identifier] = `${randomCode}`;

    setTimeout(() => {
      delete resetPasswordCodes[identifier];
    }, config.resetPasswordTimeout);

    await sendEmail(
      identifier,
      "Reset password",
      `Please use following code as the reset code: <b>${randomCode}</b>`
    );
    return res.status(200).send("Reset code sent");
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { resetCode, identifier, password } = req.body;

    if (resetPasswordCodes[identifier] !== resetCode) {
      res.status(500).send("Invalid/Expired reset code");
      return;
    }

    const foundUser = await UserModel.findOne({
      where: { identifier },
    });

    if (!foundUser) {
      res.status(401).send("User not found");
      return;
    }
    const newPassword = await bcrypt.hash(password, 10);
    await foundUser.update({ password: newPassword });
    return res.status(200).send("Password changed successfully");
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export const getAllUsers = (req: Request, res: Response) => {
  UserModel.findAll().then((result) => {
    return res.status(200).send(result);
  });
};
