import { Request, Response, NextFunction } from "express";
import {
  UserLoggedInRequest,
  cloudinaryV2,
  prismaClient,
} from "../../../utils/v1";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import {
  ProfileControllerInterface,
  ProfileControllerResponsesInterface,
} from "../../../interfaces/v1/profiles";
import {
  CreateAndUpdateUserProfileDTO,
  CreateEmergencyContactDTO,
  CreateNextOfKinDTO,
} from "../../../dtos/v1/profiles";
import {
  BadRequestError,
  InvalidRequestError,
  NotFoundError,
} from "../../../classes/error";
import fs, { PathLike } from "graceful-fs";

class ProfileController implements ProfileControllerInterface {
  async getUserProfile(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<
      ProfileControllerResponsesInterface.GetUserProfileResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const customRequest = req as UserLoggedInRequest;

    const userProfile = await prismaClient.profile.findUnique({
      where: {
        userId: customRequest.user.id,
      },
      include: {
        nextOfKins: true,
        user: {
          include: {
            followers: true,
            userFollowing: true,
            posts: true,
          },
        },
        userEmergencyContact: true,
      },
    });

    if (!userProfile) {
      next(new NotFoundError("User doesnt have a profile"));
      return;
    }
    // @ts-ignore
    delete userProfile.user.password;

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userProfile,
    });
  }
  async createProfile(
    req: Request<
      {},
      any,
      CreateAndUpdateUserProfileDTO,
      {},
      Record<string, any>
    >,
    res: Response<
      ProfileControllerResponsesInterface.CreateAndUpdateProfileResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { address, state, town, address2 } = req.body;
    const customRequest = req as UserLoggedInRequest;

    // checking if user already have a profile
    const profile = await prismaClient.profile.findUnique({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (profile) {
      next(new BadRequestError("User already have a profile"));
      return;
    }

    const userProfile = await prismaClient.profile.create({
      data: {
        userId: customRequest.user.id,
        address,
        state,
        town,
        address2,
      },
      include: {
        user: true,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userProfile,
    });
  }
  async updateProfile(
    req: Request<
      {},
      any,
      CreateAndUpdateUserProfileDTO,
      {},
      Record<string, any>
    >,
    res: Response<
      ProfileControllerResponsesInterface.CreateAndUpdateProfileResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { address, state, town, address2 } = req.body;

    const customRequest = req as UserLoggedInRequest;

    // checking if user already have a profile
    const profile = await prismaClient.profile.findUnique({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!profile) {
      next(new NotFoundError("User needs to have a profile"));
      return;
    }

    const updatedUserProfile = await prismaClient.profile.update({
      where: { userId: customRequest.user.id },
      data: {
        userId: customRequest.user.id,
        address,
        state,
        town,
        address2,
      },
      include: {
        user: true,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: updatedUserProfile,
    });
  }
  async addPassportImage(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<
      ProfileControllerResponsesInterface.ProfileResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const customRequest = req as UserLoggedInRequest;

    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new InvalidRequestError("A file upload is required"));
      return;
    }

    // checking if user already have a profile
    const profile = await prismaClient.profile.findUnique({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!profile) {
      next(new NotFoundError("User needs to have a profile"));
      return;
    }

    const files = customRequest.files as Express.Multer.File[];

    if (files.length > 1) {
      next(new BadRequestError("a maximum upload of one file"));
      return;
    }

    const filePath = files[0]["path"] as PathLike;

    const fileName = files[0]["filename"];
    try {
      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storage/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }
              await prismaClient.profile.update({
                where: {
                  userId: customRequest.user.id,
                },
                data: {
                  passportImage: result!.secure_url,
                },
              });

              fs.unlink(filePath, (unLinkErr) => {
                if (unLinkErr) {
                  throw unLinkErr;
                }

                return res.status(ResponseStatusCodeEnum.OK).json({
                  status: ResponseStatusSignalEnum.SUCCESS,
                  payload: "passport uploaded successfully!",
                });
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async addNextOfKin(
    req: Request<{}, any, CreateNextOfKinDTO, {}, Record<string, any>>,
    res: Response<
      ProfileControllerResponsesInterface.CreateNextOfKinResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const {
      address,
      name,
      phoneNumber,
      relationshipType,
      state,
      town,
      address2,
    } = req.body;
    const customRequest = req as UserLoggedInRequest;

    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new InvalidRequestError("A file upload is required"));
      return;
    }

    const files = customRequest.files as Express.Multer.File[];

    if (files.length > 1) {
      next(new BadRequestError("a maximum upload of one file"));
      return;
    }

    try {
      const userProfile = await prismaClient.profile.findUnique({
        where: {
          userId: customRequest.user.id,
        },
      });

      if (!userProfile) {
        next(new NotFoundError("User needs to have a profile"));
        return;
      }

      const userNextOfKin = await prismaClient.userNextOfKin.findFirst({
        where: {
          profile: {
            userId: customRequest.user.id,
          },
        },
      });
      if (userNextOfKin) {
        next(new BadRequestError("User already have next of kin"));
        return;
      }

      const filePath = files[0]["path"] as PathLike;

      const fileName = files[0]["filename"];

      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storage/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }
              const createdUserNextOfKin =
                await prismaClient.userNextOfKin.create({
                  data: {
                    profileId: userProfile.id,
                    address,
                    name,
                    passportImage: result!.secure_url,
                    phoneNumber,
                    relationshipType,
                    state,
                    town,
                    address2,
                  },
                });

              fs.unlink(filePath, (unLinkErr) => {
                if (unLinkErr) {
                  throw unLinkErr;
                }

                return res.status(ResponseStatusCodeEnum.OK).json({
                  status: ResponseStatusSignalEnum.SUCCESS,
                  payload: createdUserNextOfKin,
                });
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async addEmergencyOfContact(
    req: Request<{}, any, CreateEmergencyContactDTO, {}, Record<string, any>>,
    res: Response<
      ProfileControllerResponsesInterface.CreateEmergencyContactResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const {
      address,
      name,
      phoneNumber,
      relationshipType,
      state,
      town,
      address2,
    } = req.body;
    const customRequest = req as UserLoggedInRequest;

    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new InvalidRequestError("A file upload is required"));
      return;
    }

    const files = customRequest.files as Express.Multer.File[];

    if (files.length > 1) {
      next(new BadRequestError("a maximum upload of one file"));
      return;
    }

    try {
      const userProfile = await prismaClient.profile.findUnique({
        where: {
          userId: customRequest.user.id,
        },
      });

      if (!userProfile) {
        next(new NotFoundError("User needs to have a profile"));
        return;
      }

      const userEmergencyContact =
        await prismaClient.userEmergencyContact.findFirst({
          where: {
            profile: {
              userId: customRequest.user.id,
            },
          },
        });
      if (userEmergencyContact) {
        next(new BadRequestError("User already have an emergency contact"));
        return;
      }

      const filePath = files[0]["path"] as PathLike;

      const fileName = files[0]["filename"];

      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storage/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }
              const createdUserEmegencyContact =
                await prismaClient.userEmergencyContact.create({
                  data: {
                    profileId: userProfile.id,
                    address,
                    name,
                    passportImage: result!.secure_url,
                    phoneNumber,
                    relationshipType,
                    state,
                    town,
                    address2,
                  },
                });

              fs.unlink(filePath, (unLinkErr) => {
                if (unLinkErr) {
                  throw unLinkErr;
                }

                return res.status(ResponseStatusCodeEnum.OK).json({
                  status: ResponseStatusSignalEnum.SUCCESS,
                  payload: createdUserEmegencyContact,
                });
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default ProfileController;
