import { NextFunction, Request, Response } from "express";
import { UserControllerInterface } from "../../../interfaces/v1/users";
import {
  AccountActivationDTO,
  CompleteUserDetailsInfoDTO,
  ForgotPasswordDTO,
  LoginDTO,
  PreCreateAnAccountAsUserDTO,
  ResetPasswordDTO,
} from "../../../dtos/v1/users";
import { hashToken, setToken } from "../../../utils/v1/users";
import { prismaClient } from "../../../utils/v1";
import { sendActivationTokenToUserMail } from "../../../utils/v1/emails/users/handlers";
import { PreRegisterAccountWithEmailResponse } from "../../../interfaces/v1/users/user-controller-responses.interface";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
  RolesEnum,
} from "../../../enums/v1";
import { BadRequestError } from "../../../classes/error";

class UserController implements UserControllerInterface {
  async preRegisterAccountWithEmail(
    req: Request<{}, any, PreCreateAnAccountAsUserDTO, {}, Record<string, any>>,
    res: Response<PreRegisterAccountWithEmailResponse>,
    next: NextFunction
  ): Promise<void> {
    const { answer, email, secretQuestion } = req.body;

    const userExists = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      //TODO: throw an error to the client
      throw new BadRequestError("User Already Exist");
    }

    // generate an activation link
    const activationToken = setToken();

    const newUser = await prismaClient.user.create({
      data: {
        email,
        role: RolesEnum.AUDIENCE,
        userActivationToken: {
          create: {
            token: hashToken(activationToken),
          },
        },
        secretQuestion: {
          create: {
            answer,
            question: secretQuestion,
          },
        },
      },
    });

    try {
      await sendActivationTokenToUserMail(newUser, activationToken);
      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload:
          "Kindly check your email to fully activate and create your account",
      });
    } catch (error) {
      next(error);
    }
  }
  async completeUserRegistration(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async login(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async activateAccountWithOtp(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async forgotPassword(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async resetPassword(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default new UserController();
