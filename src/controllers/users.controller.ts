import { Request, Response } from "express";
import { User, UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import { removeSensitiveData, setCookies } from "../util/helper";
import { verify } from "jsonwebtoken";
import { config } from "../config";
import { sendEmail } from "../services/mail.service";
import { clearAllCookies } from "../util/helper";

const resetPasswordCodes: any = {};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    // Check whether any user exist with same credentials
    const foundUser = await UserModel.findOne({
      where: { identifier },
    });
    if(foundUser) {
      return res.status(409).send('User already exist with the email or phone number you provided');
    }

    const hash = await bcrypt.hash(password, 10);
    req.body.password = hash;
    const user = await UserModel.create(req.body);
    const responseData = removeSensitiveData(user);
    setCookies(responseData, res);

    return res.status(201).send(responseData);
  } catch (e: any) {
    console.error(e);
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
    const responseData = removeSensitiveData(foundUser);
    const { refreshToken } = setCookies(responseData, res);
    await foundUser.update({ refreshToken });

    return res.status(200).send(responseData);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const foundUser = await UserModel.findOne({
      where: { id },
    });
    if (foundUser) {
      foundUser.changed('updatedAt', true); // to forcefully update the timestamp
      const updated = await foundUser.update(req.body);
      return res.status(201).send(updated);
    } else {
      return res.status(404).send({});
    }
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const resRefreshToken = req.cookies["refresh-token"];

    if (!resRefreshToken) {
      return res.status(401).send("Refresh token not found");
    }
    const foundUser = await UserModel.findOne({
      where: { refreshToken: resRefreshToken },
    });

    // if refresh-token reuse or hacked
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

    const responseData = removeSensitiveData(foundUser);

    const { refreshToken } = setCookies(responseData, res);
    await foundUser.update({ refreshToken });
    return res.status(200).send(responseData);
  } catch (e: any) {
    console.error(e);
    return res.status(500).send(e.message);
  }
};

export const loggedInUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
      return res.status(401).send("Access token not found");
    }

    const decodedUser = verify(accessToken, config.accessTokenSecret) as User;

    const foundUser = await UserModel.findOne({
      where: { id: decodedUser.id },
    });

    if (!foundUser) {
      return res.status(500).send("User not found");
    }

    const responseData = removeSensitiveData(foundUser);
    setCookies(responseData, res);
    
    return res.status(200).send(responseData);
  } catch (e: any) {
    console.error(e);
    return res.status(200).send(e.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const resRefreshToken = req.cookies["refresh-token"];

    if (!resRefreshToken) {
      return res.status(401).send("Refresh token not found");
    }

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
    console.error(e);
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
    console.error(e);
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
    console.error(e);
    return res.status(500).send(e.message);
  }
};
