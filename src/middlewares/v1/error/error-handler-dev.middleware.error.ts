import { NextFunction, Response, Request } from "express";
import { CustomError } from "../../../classes/abstract/error";
import {
  MulterErrorMessage,
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import multer from "multer";
import fs, { PathLike } from "graceful-fs";

export default (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.files !== undefined && req.files.length) {
    const files = req.files as Express.Multer.File[];
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i]["path"] as PathLike;

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            return res.status(ResponseStatusCodeEnum.NOT_FOUND).json({
              status: ResponseStatusSignalEnum.FAILED,
              errors: [
                {
                  message: "File does not exist",
                },
              ],
            });
          } else {
            return res.status(ResponseStatusCodeEnum.SERVER_ERROR).json({
              status: ResponseStatusSignalEnum.FAILED,
              errors: [
                {
                  message: err.message,
                },
              ],
            });
          }
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              return res.status(ResponseStatusCodeEnum.SERVER_ERROR).json({
                status: ResponseStatusSignalEnum.FAILED,
                errors: [
                  {
                    message: err.message,
                  },
                ],
              });
            }
            return;
          });
        }
      });
    }
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json(err.serializeErrors());
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(ResponseStatusCodeEnum.BAD).json({
        status: ResponseStatusSignalEnum.FAILED,
        errors: [
          {
            message: MulterErrorMessage.LIMIT_FILE_SIZE,
          },
        ],
      });
    } else if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(ResponseStatusCodeEnum.BAD).json({
        status: ResponseStatusSignalEnum.FAILED,
        errors: [
          {
            message: MulterErrorMessage.LIMIT_FILE_COUNT,
          },
        ],
      });
    } else {
      return res.status(ResponseStatusCodeEnum.BAD).json({
        status: ResponseStatusSignalEnum.FAILED,
        errors: [
          {
            message: err.message,
          },
        ],
      });
    }
  }
  res.status(ResponseStatusCodeEnum.BAD).json({
    status: ResponseStatusSignalEnum.FAILED,
    errors: [
      {
        message: err.message,
      },
    ],
  });
};
