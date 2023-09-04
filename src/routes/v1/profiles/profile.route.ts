import { router } from "../../../utils/v1";
import { uploadImageStorage } from "../../../middlewares/v1/upload";
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
    uploadImageStorage.any(),
    profileController.addPassportImage
  );

router
  .route("/add/kin")
  .patch(
    requiresAuthMiddleware,
    uploadImageStorage.any(),
    addNextofkinValidator,
    requestValidationMiddleware,
    profileController.addNextOfKin
  );
router
  .route("/add/emergency-contact")
  .patch(
    requiresAuthMiddleware,
    uploadImageStorage.any(),
    addEmergencycontactValidator,
    requestValidationMiddleware,
    profileController.addEmergencyOfContact
  );

export default router;
