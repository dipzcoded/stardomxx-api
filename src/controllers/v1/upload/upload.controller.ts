import { Request, Response, NextFunction } from "express";

import {
  UploadControllerInterface,
  UploadResponseInterface,
} from "../../../interfaces/v1/upload";
import { BadRequestError } from "../../../classes/error";
import fs, { PathLike } from "graceful-fs";
import { cloudinaryV2 } from "../../../utils/v1";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";

class UploadController implements UploadControllerInterface {
  async uploadImages(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<UploadResponseInterface, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    if (req.files === undefined || !req.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }

    let mediaContent = "";
    const files = req.files as Express.Multer.File[];

    for (let x = 0; x < files.length; x++) {
      const filePath = files[x]["path"] as PathLike;
      const fileName = files[x]["filename"];
      const fileDescriptor = fs.openSync(filePath, "r");
      try {
        const response = await cloudinaryV2.uploader.upload(
          filePath.toString(),
          {
            resource_type: "raw",
            folder: "storage/upload/",
            public_id: fileName,
            use_filename: true,
            unique_filename: false,
          }
        );
        mediaContent += `${response.secure_url}${
          files?.length - 1 === x ? "" : ","
        }`;
      } catch (error) {
        fs.unlinkSync(filePath);
        fs.closeSync(fileDescriptor);
      } finally {
        fs.unlinkSync(filePath);
        fs.closeSync(fileDescriptor);
      }
    }

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: mediaContent,
    });
  }
  async uploadVideos(
    req: Request<{}, any, any, {}, Record<string, any>>,
    res: Response<UploadResponseInterface, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    if (req.files === undefined || !req.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }

    const files = req.files as Express.Multer.File[];
    let mediaContent = "";
    const filePath = files[0]["path"] as PathLike;
    const fileName = files[0]["filename"];
    const fileDescriptor = fs.openSync(filePath, "r");
    try {
      const response = await cloudinaryV2.uploader.upload(filePath.toString(), {
        resource_type: "video",
        folder: "storage/upload/",
        public_id: fileName,
        use_filename: true,
        unique_filename: false,
      });
      mediaContent = response.secure_url;
    } catch (error) {
      fs.close(fileDescriptor, () => {
        fs.unlink(filePath, (unlinkErr) => {});
      });
    } finally {
      fs.close(fileDescriptor, () => {
        fs.unlink(filePath, (unlinkErr) => {});
      });
    }

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: mediaContent,
    });
  }
}

export default UploadController;

// try {
//     fs.open(filePath, "r", (openErr, fd) => {
//       if (openErr) {
//         throw openErr;
//       }

//       fs.close(fd, (closeErr) => {
//         if (closeErr) {
//           throw closeErr;
//         }

//         cloudinaryV2.uploader.upload(
//           filePath.toString(),
//           {
//             resource_type: "raw",
//             folder: "storgae/upload/",
//             public_id: fileName,
//             use_filename: true,
//             unique_filename: false,
//           },
//           async (cloudErr, result) => {
//             if (cloudErr) {
//               throw cloudErr;
//             }

//             mediaContent = result!.secure_url;

//             fs.unlink(filePath, (unlinkErr) => {
//               if (unlinkErr) {
//                 throw unlinkErr;
//               }
//             });
//           }
//         );
//       });
//     });
//   } catch (error) {
//     next(error);
//     return;
//   }
