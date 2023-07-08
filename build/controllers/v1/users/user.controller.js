"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../../../utils/v1/users");
const v1_1 = require("../../../utils/v1");
const handlers_1 = require("../../../utils/v1/emails/users/handlers");
const v1_2 = require("../../../enums/v1");
const error_1 = require("../../../classes/error");
const hash_user_password_util_1 = require("../../../utils/v1/users/hash-user-password.util");
const generate_token_util_1 = require("../../../utils/v1/users/generate-token.util");
const password_reset_email_handler_1 = require("../../../utils/v1/emails/users/handlers/password-reset-email.handler");
class UserController {
    init(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const getAllUsers = yield v1_1.prismaClient.user.findMany({});
            res.json({ allUsers: getAllUsers });
        });
    }
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { country, email, password, phoneNumber, firstName, lastName } = req.body;
            try {
                const userFound = yield v1_1.prismaClient.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (userFound) {
                    // TODO: throw an error message
                    throw new error_1.BadRequestError("User already exist with the provided email");
                }
            }
            catch (error) {
                next(error);
                return;
            }
            const token = (0, users_1.setToken)();
            // create an account
            const newUser = yield v1_1.prismaClient.user.create({
                data: {
                    email,
                    role: v1_2.RolesEnum.AUDIENCE,
                    country,
                    firstName,
                    lastName,
                    phoneNumber,
                    password: yield (0, users_1.hashUserPassword)(password),
                    userActivationToken: {
                        create: {
                            token: (0, users_1.hashToken)(token),
                        },
                    },
                },
            });
            let url = `${process.env.PROD_FRONTEND_URL}/user/activate?token=${token}`;
            try {
                yield (0, handlers_1.sendActivationTokenToUserMail)(newUser, url);
                res.status(v1_2.ResponseStatusCodeEnum.CREATED).json({
                    status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                    payload: "Check your email to activate your account",
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    activateAccountWithToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token } = req.query;
            const hashedToken = (0, users_1.hashToken)(token);
            const userFoundWithToken = yield v1_1.prismaClient.user.findFirst({
                where: {
                    userActivationToken: {
                        token: hashedToken,
                    },
                },
            });
            if (!userFoundWithToken) {
                // TODO: throw an error
                next(new error_1.InvalidRequestError("invalid token"));
                return;
            }
            // update the user isActivate state to true;
            yield v1_1.prismaClient.user.update({
                where: {
                    email: userFoundWithToken === null || userFoundWithToken === void 0 ? void 0 : userFoundWithToken.email,
                },
                data: {
                    isActivated: true,
                },
            });
            // delete user token
            yield v1_1.prismaClient.userActivationToken.delete({
                where: {
                    userId: userFoundWithToken.id,
                },
            });
            res.status(v1_2.ResponseStatusCodeEnum.OK).json({
                status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                payload: "User account is activated",
            });
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // find if user exist by email;
            let user;
            user = yield v1_1.prismaClient.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                // TODO: throw an error
                next(new error_1.InvalidRequestError("Invalid Credentails"));
                return;
            }
            const isPassordMatch = yield (0, hash_user_password_util_1.compareUserPassword)(password, user);
            if (!isPassordMatch) {
                // TODO: throw an error
                next(new error_1.InvalidRequestError("Invalid Credentails"));
                return;
            }
            if (!user.isActivated) {
                // TODO: throw an error
                next(new error_1.ForbiddenError("Activate your account before logged in"));
                return;
            }
            // Generate jwt token
            const userJwtToken = (0, users_1.generateAccessToken)(user);
            res.status(v1_2.ResponseStatusCodeEnum.OK).json({
                status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                payload: userJwtToken,
            });
        });
    }
    getCurrentLoggedInUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const customRequest = req;
            const userLoggedin = yield v1_1.prismaClient.user.findUnique({
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
            res.status(v1_2.ResponseStatusCodeEnum.OK).json({
                status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                payload: userLoggedin,
            });
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            let userFound;
            userFound = yield v1_1.prismaClient.user.findUnique({
                where: {
                    email,
                },
            });
            if (!userFound) {
                // TODO: throw an error
                next(new error_1.BadRequestError("User doesnt exist with the email provided."));
                return;
            }
            // check if user have password reset token;
            const userPasswordResetFound = yield v1_1.prismaClient.passwordResetToken.findUnique({
                where: {
                    userId: userFound.id,
                },
            });
            if (userPasswordResetFound) {
                yield v1_1.prismaClient.passwordResetToken.delete({
                    where: {
                        userId: userFound.id,
                    },
                });
            }
            // re
            const passwordResetToken = (0, users_1.setToken)();
            userFound = yield v1_1.prismaClient.user.update({
                where: {
                    id: userFound.id,
                },
                data: {
                    passwordResetToken: {
                        create: {
                            token: (0, users_1.hashToken)(passwordResetToken),
                            expirationinseconds: (0, generate_token_util_1.setPasswordResetTokenExpiresDate)(),
                        },
                    },
                },
            });
            let url = `${process.env.PROD_FRONTEND_URL}/user/password-reset?token=${passwordResetToken}`;
            try {
                yield (0, password_reset_email_handler_1.userPasswordResetMail)(userFound, url);
                res.status(v1_2.ResponseStatusCodeEnum.OK).json({
                    status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                    payload: "Check your mail for password reset",
                });
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    resetPassword(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { resetToken, newPassword } = req.body;
            const hashedToken = (0, users_1.hashToken)(resetToken);
            const userWithToken = yield v1_1.prismaClient.user.findFirst({
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
                next(new error_1.InvalidRequestError("Token is invalid"));
                return;
            }
            if (((_a = userWithToken.passwordResetToken) === null || _a === void 0 ? void 0 : _a.expirationinseconds) > Date.now()) {
                let user = yield v1_1.prismaClient.user.update({
                    where: {
                        id: userWithToken.id,
                    },
                    data: {
                        password: yield (0, users_1.hashUserPassword)(newPassword),
                    },
                });
                // delete password reset
                yield v1_1.prismaClient.passwordResetToken.delete({
                    where: {
                        userId: user.id,
                    },
                });
                const userJwtToken = (0, users_1.generateAccessToken)(user);
                res.status(v1_2.ResponseStatusCodeEnum.OK).json({
                    status: v1_2.ResponseStatusSignalEnum.SUCCESS,
                    payload: userJwtToken,
                });
            }
            else {
                yield v1_1.prismaClient.passwordResetToken.delete({
                    where: {
                        userId: userWithToken.id,
                    },
                });
                next(new error_1.InvalidRequestError("Token is expired"));
                return;
            }
        });
    }
}
exports.default = new UserController();
