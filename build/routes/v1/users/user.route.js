"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const v1_1 = require("../../../utils/v1");
const v1_2 = require("../../../controllers/v1");
const users_1 = require("../../../middlewares/v1/validator/users");
const validator_1 = require("../../../middlewares/v1/validator");
const auth_1 = require("../../../middlewares/v1/auth");
const { activateAccountWithToken, forgotPassword, getCurrentLoggedInUser, login, registration, resetPassword, init, } = v1_2.userController;
// non protected routes
v1_1.router.route("/init").get(init);
v1_1.router
    .route("/signup")
    .post(users_1.registrationValidator, validator_1.requestValidationMiddleware, registration);
v1_1.router.route("/login").post(users_1.loginValidator, validator_1.requestValidationMiddleware, login);
v1_1.router
    .route("/account-activation")
    .patch(users_1.accountActivationValidator, validator_1.requestValidationMiddleware, activateAccountWithToken);
v1_1.router
    .route("/forgot-password")
    .post(users_1.forgotPasswordValidator, validator_1.requestValidationMiddleware, forgotPassword);
v1_1.router
    .route("/password-reset")
    .patch(users_1.resetPasswordValidator, validator_1.requestValidationMiddleware, resetPassword);
// protected routes
v1_1.router
    .route("/current-user")
    .get(auth_1.requiresAuthMiddleware, getCurrentLoggedInUser);
exports.default = v1_1.router;
