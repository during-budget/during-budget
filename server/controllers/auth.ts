import { Request, Response } from "express";
import _ from "lodash";

import { logger } from "../log/logger";
import { IUser, IUserProps, User } from "../models/User";
import { NextFunction } from "express-serve-static-core";

import passport from "passport";
import { HydratedDocument } from "mongoose";

import * as messages from "../passport/messages"

const clientRedirectURL = process.env.CLIENT.trim()+"/redirect";


const clientAdminURL = process.env.CLIENT_ADMIN.trim();

export const find = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    return res.status(200).send({
      snsId: user.snsId ?? {},
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export const callbackAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "googleAdmin",
    async (authError: Error, user: HydratedDocument<IUser, IUserProps>) => {
      try {
        if (authError) throw authError;
        return req.login(user, (loginError) => {
          if (loginError) throw loginError;
          return res.redirect(clientAdminURL + "/login/redirect");
        });
      } catch (err: any) {
        return res.redirect(
          clientAdminURL +
            "?error=" +
            encodeURIComponent(err.message ?? "unknown error occured")
        );
      }
    }
  )(req, res, next);
};

export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const provider = req.params.provider;
  if (provider !== "google" && provider !== "naver" && provider !== "kakao") {
    return res.redirect(
      clientRedirectURL +
        "?message=" +
        encodeURIComponent(messages.INVALID_REQUEST)
    );
  }

  passport.authenticate(
    provider,
    async (
      authError: Error,
      user: HydratedDocument<IUser, IUserProps>,
      type: "login" | "register" | "connect"
    ) => {
      try {
        if (authError) {
          return res.redirect(
            clientRedirectURL +
              `?message=${encodeURIComponent(
                authError.message
              )}`
          );
        }

        /* _____ 소셜 로그인 _____ */
        if (type === "login") {
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 로그인 성공
            return res.redirect(
              clientRedirectURL +
                `?message=${encodeURIComponent(messages.LOGIN_SUCCESS)}`
            );
          });
        } else if (type === "register") {
        /* _____ 소셜 회원 가입 _____ */
          return req.login(user, (loginError) => {
            if (loginError) {
              throw loginError;
            }
            // 회원 가입 후 로그인 성공
            return res.redirect(
              clientRedirectURL +
                `?message=${messages.REGISTER_SUCCESS}`
            );
          });
        }
        /* _____ 소셜 계정 연결 _____ */
        // 소셜 계정 연결 성공
        return res.redirect(
          clientRedirectURL +
            `?message=${encodeURIComponent(messages.CONNECT_SUCCESS)}`
        );
      } catch (err: any) {
        return res.redirect(
          clientRedirectURL +
            `?message=${encodeURIComponent(
              messages.AUTH_FAILED_UNKNOWN_ERROR
            )}`
        );
      }
    }
  )(req, res, next);
};

export const disconnect = async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider;
    if (provider !== "google" && provider !== "naver" && provider !== "kakao") {
      return res.status(400).send({ message: "invalid sns" });
    }

    const user = req.user!;
    if (!user.snsId || !user.snsId[provider]) {
      return res.status(404).send({ message: "not connected" });
    }

    user.snsId = { ...user.snsId, [provider]: undefined };
    if (
      !user.isLocal &&
      !user.snsId.google &&
      !user.snsId.naver &&
      !user.snsId.kakao
    ) {
      return res
        .status(409)
        .send({ message: "At least one login method is required." });
    }
    await user.saveReqUser();

    return res.status(200).send({
      snsId: user.snsId,
    });
  } catch (err: any) {
    logger.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};
