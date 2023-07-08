import { NextFunction, Request, Response } from "express";
import { UserControllerInterface } from "../../../interfaces/v1/users";
import {
  CompleteUserDetailsInfoDTO,
  ForgotPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
} from "../../../dtos/v1/users";
import {
  generateAccessToken,
  hashToken,
  hashUserPassword,
  setToken,
} from "../../../utils/v1/users";
import { UserLoggedInRequest, prismaClient } from "../../../utils/v1";
import { sendActivationTokenToUserMail } from "../../../utils/v1/emails/users/handlers";
import {
  UserResponse,
  GetCurrentLoggedinUserResponse,
} from "../../../interfaces/v1/users/user-controller-responses.interface";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
  RolesEnum,
} from "../../../enums/v1";
import {
  BadRequestError,
  ForbiddenError,
  InvalidRequestError,
} from "../../../classes/error";
import { User } from "@prisma/client";
import { compareUserPassword } from "../../../utils/v1/users/hash-user-password.util";
import { setPasswordResetTokenExpiresDate } from "../../../utils/v1/users/generate-token.util";
import { userPasswordResetMail } from "../../../utils/v1/emails/users/handlers/password-reset-email.handler";

class UserController implements UserControllerInterface {
  async init(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const getAllUsers = await prismaClient.user.findMany({});
    res.json({ allUsers: getAllUsers });
  }
  async registration(
    req: Request<{}, any, CompleteUserDetailsInfoDTO, {}, Record<string, any>>,
    res: Response<UserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { country, email, password, phoneNumber, firstName, lastName } =
      req.body;

    try {
      const userFound = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });
      if (userFound) {
        // TODO: throw an error message
        throw new BadRequestError("User already exist with the provided email");
      }
    } catch (error) {
      next(error);
      return;
    }

    const token = setToken();

    // create an account
    const newUser = await prismaClient.user.create({
      data: {
        email,
        role: RolesEnum.AUDIENCE,
        country,
        firstName,
        lastName,
        phoneNumber,
        password: await hashUserPassword(password),
        userActivationToken: {
          create: {
            token: hashToken(token),
          },
        },
      },
    });

    let url = `${process.env.PROD_FRONTEND_URL}/user/activate?token=${token}`;

    try {
      await sendActivationTokenToUserMail(newUser, url);
      res.status(ResponseStatusCodeEnum.CREATED).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: "Check your email to activate your account",
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async activateAccountWithToken(
    req: Request<{}, any, any, { token: string }, Record<string, any>>,
    res: Response<UserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { token } = req.query;

    const hashedToken = hashToken(token);

    const userFoundWithToken = await prismaClient.user.findFirst({
      where: {
        userActivationToken: {
          token: hashedToken,
        },
      },
    });

    if (!userFoundWithToken) {
      // TODO: throw an error
      next(new InvalidRequestError("invalid token"));
      return;
    }

    // update the user isActivate state to true;
    await prismaClient.user.update({
      where: {
        email: userFoundWithToken?.email,
      },
      data: {
        isActivated: true,
      },
    });

    // delete user token
    await prismaClient.userActivationToken.delete({
      where: {
        userId: userFoundWithToken.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "User account is activated",
    });
  }
  async login(
    req: Request<{}, any, LoginDTO, {}, Record<string, any>>,
    res: Response<UserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    // find if user exist by email;

    let user: User | null;

    user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // TODO: throw an error
      next(new InvalidRequestError("Invalid Credentails"));
      return;
    }

    const isPassordMatch = await compareUserPassword(password, user);
    if (!isPassordMatch) {
      // TODO: throw an error
      next(new InvalidRequestError("Invalid Credentails"));
      return;
    }

    if (!user.isActivated) {
      // TODO: throw an error
      next(new ForbiddenError("Activate your account before logged in"));
      return;
    }

    // Generate jwt token
    const userJwtToken = generateAccessToken(user);

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userJwtToken,
    });
  }

  async getCurrentLoggedInUser(
    req: Request,
    res: Response<GetCurrentLoggedinUserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const customRequest = req as UserLoggedInRequest;

    const userLoggedin = await prismaClient.user.findUnique({
      where: {
        id: customRequest.user.id,
      },
      include: {
        followers: true,
        posts: true,
        profile: true,
        userFollowing: true,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userLoggedin!,
    });
  }

  async forgotPassword(
    req: Request<{}, any, ForgotPasswordDTO, {}, Record<string, any>>,
    res: Response<UserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;
    let userFound: User | null;

    userFound = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!userFound) {
      // TODO: throw an error
      next(new BadRequestError("User doesnt exist with the email provided."));
      return;
    }

    // check if user have password reset token;
    const userPasswordResetFound =
      await prismaClient.passwordResetToken.findUnique({
        where: {
          userId: userFound.id,
        },
      });

    if (userPasswordResetFound) {
      await prismaClient.passwordResetToken.delete({
        where: {
          userId: userFound.id,
        },
      });
    }

    // re
    const passwordResetToken = setToken();
    userFound = await prismaClient.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        passwordResetToken: {
          create: {
            token: hashToken(passwordResetToken),
            expirationinseconds: setPasswordResetTokenExpiresDate(),
          },
        },
      },
    });

    let url = `${process.env.PROD_FRONTEND_URL}/user/password-reset?token=${passwordResetToken}`;

    try {
      await userPasswordResetMail(userFound, url);
      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: "Check your mail for password reset",
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async resetPassword(
    req: Request<{}, any, ResetPasswordDTO, {}, Record<string, any>>,
    res: Response<UserResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { resetToken, newPassword } = req.body;

    const hashedToken = hashToken(resetToken);

    const userWithToken = await prismaClient.user.findFirst({
      where: {
        passwordResetToken: {
          token: hashedToken,
        },
      },
      include: {
        passwordResetToken: true,
      },
    });

    // expirationinseconds: {
    //   gt: Date.now(),
    // },

    if (!userWithToken) {
      // TODO: throw an error
      next(new InvalidRequestError("Token is invalid"));
      return;
    }

    if (userWithToken.passwordResetToken?.expirationinseconds! > Date.now()) {
      let user = await prismaClient.user.update({
        where: {
          id: userWithToken.id,
        },
        data: {
          password: await hashUserPassword(newPassword),
        },
      });

      // delete password reset
      await prismaClient.passwordResetToken.delete({
        where: {
          userId: user.id,
        },
      });

      const userJwtToken = generateAccessToken(user);

      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: userJwtToken,
      });
    } else {
      await prismaClient.passwordResetToken.delete({
        where: {
          userId: userWithToken.id,
        },
      });
      next(new InvalidRequestError("Token is expired"));
      return;
    }
  }
}

export default new UserController();
