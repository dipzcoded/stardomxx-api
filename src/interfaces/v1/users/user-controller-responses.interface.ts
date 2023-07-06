import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface PreRegisterAccountWithEmailResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface CompleteUserRegistrationResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface LoginResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface ForgotPasswordResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface ResetPasswordResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}
