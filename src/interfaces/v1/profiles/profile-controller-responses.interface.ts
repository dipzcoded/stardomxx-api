import {
  Profile,
  User,
  UserEmergencyContact,
  UserNextOfKin,
} from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface ProfileResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface GetUserProfileResponse {
  status: ResponseStatusSignalEnum;
  payload:
    | (Profile & {
        nextOfKins: UserNextOfKin | null;
        user: User;
        userEmergencyContact: UserEmergencyContact | null;
      })
    | null;
}

export interface CreateAndUpdateProfileResponse {
  status: ResponseStatusSignalEnum;
  payload: Profile;
}

export interface CreateNextOfKinResponse {
  status: ResponseStatusSignalEnum;
  payload: UserNextOfKin;
}

export interface CreateEmergencyContactResponse {
  status: ResponseStatusSignalEnum;
  payload: UserEmergencyContact;
}
