import { router } from "../../../utils/v1";
import { userController } from "../../../controllers/v1";
import {
  accountActivationValidator,
  forgotPasswordValidator,
  loginValidator,
  registrationValidator,
  resetPasswordValidator,
} from "../../../middlewares/v1/validator/users";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
const {
  activateAccountWithToken,
  forgotPassword,
  getCurrentLoggedInUser,
  login,
  registration,
  resetPassword,
  init,
} = userController;

// non protected routes
router.route("/init").get(init);
router
  .route("/signup")
  .post(registrationValidator, requestValidationMiddleware, registration);
router.route("/login").post(loginValidator, requestValidationMiddleware, login);
router
  .route("/account-activation")
  .patch(
    accountActivationValidator,
    requestValidationMiddleware,
    activateAccountWithToken
  );
router
  .route("/forgot-password")
  .post(forgotPasswordValidator, requestValidationMiddleware, forgotPassword);
router
  .route("/password-reset")
  .patch(resetPasswordValidator, requestValidationMiddleware, resetPassword);

// protected routes
router
  .route("/current-user")
  .get(requiresAuthMiddleware, getCurrentLoggedInUser);

export default router;
