import { router } from "../../../utils/v1";
import { UserController } from "../../../controllers/v1";
import {
  accountActivationValidator,
  forgotPasswordValidator,
  loginValidator,
  registrationValidator,
  resetPasswordValidator,
} from "../../../middlewares/v1/validator/users";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
const userController = new UserController();

// non protected routes
router.route("/init").get(userController.init);
router
  .route("/signup")
  .post(
    registrationValidator,
    requestValidationMiddleware,
    userController.registration
  );
router
  .route("/login")
  .post(loginValidator, requestValidationMiddleware, userController.login);
router
  .route("/account-activation")
  .patch(
    accountActivationValidator,
    requestValidationMiddleware,
    userController.activateAccountWithToken
  );
router
  .route("/forgot-password")
  .post(
    forgotPasswordValidator,
    requestValidationMiddleware,
    userController.forgotPassword
  );
router
  .route("/password-reset")
  .patch(
    resetPasswordValidator,
    requestValidationMiddleware,
    userController.resetPassword
  );

// protected routes
router
  .route("/current-user")
  .get(requiresAuthMiddleware, userController.getCurrentLoggedInUser);

export default router;
