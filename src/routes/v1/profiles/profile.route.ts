import { router } from "../../../utils/v1";
import { uploadStorage } from "../../../middlewares/v1/upload";
import { ProfileController } from "../../../controllers/v1";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
import {
  addEmergencycontactValidator,
  addNextofkinValidator,
  createProfileValidator,
} from "../../../middlewares/v1/validator/profiles";
const profileController = new ProfileController();

router
  .route("/user")
  .get(requiresAuthMiddleware, profileController.getUserProfile)
  .post(
    requiresAuthMiddleware,
    createProfileValidator,
    requestValidationMiddleware,
    profileController.createProfile
  );

router
  .route("/upload-passport")
  .patch(
    requiresAuthMiddleware,
    uploadStorage.any(),
    profileController.addPassportImage
  );

router
  .route("/add/kin")
  .patch(
    requiresAuthMiddleware,
    uploadStorage.any(),
    addNextofkinValidator,
    requestValidationMiddleware,
    profileController.addNextOfKin
  );
router
  .route("/add/emergency-contact")
  .patch(
    requiresAuthMiddleware,
    uploadStorage.any(),
    addEmergencycontactValidator,
    requestValidationMiddleware,
    profileController.addEmergencyOfContact
  );

export default router;
