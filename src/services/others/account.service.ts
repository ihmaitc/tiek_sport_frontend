import { AxiosRequestConfig } from "axios";
import ApiService from "../api.service";

const AccountService = {
  Login(data: any, Headers: any) {
    return ApiService.post("account/Login", data, Headers);
  },
  LoginByEImzo(data: any) {
    return ApiService.post("account/LoginByEImzo", data);
  },
  GetUserInfo(data: any) {
    return ApiService.get("account/GetUserInfo");
  },
  ChangeLanguage(data: any) {
    return ApiService.post("account/ChangeLanguage", data);
  },
  GetChallenge() {
    return ApiService.get("account/GetChallenge");
  },
  IsUserRegistered(data: any) {
    return ApiService.post("account/IsUserRegistered", data);
  },
  SendSMSCode(data: any, headers: any) {
    return ApiService.post("account/SendSMSCode", data, headers);
  },
  CheckSMSCode(data: any, headers: any) {
    return ApiService.post("account/CheckSMSCode", data, headers);
  },
  Registrate(data: any, headers: any) {
    return ApiService.post("account/Registrate", data, headers);
  },
  LoginTwoFactor(data: any, headers: AxiosRequestConfig) {
    return ApiService.post("account/LoginTwoFactor", data, headers);
  },
  GetByPassportData(Seria: string, Number: string, DateOfBirth: string) {
    return ApiService.get(`account/GetByPassportData?Seria=${Seria}&Number=${Number}&DateOfBirth=${DateOfBirth}`);
  },
  IsUserRegisteredDto(data: any) {
    return ApiService.post("account/IsUserRegisteredDto", data);
  },
  RestorePassword(data: any) {
    return ApiService.post("account/RestorePassword", data);
  },
  RestorePasswordConfirm(data: any, headers: AxiosRequestConfig) {
    return ApiService.post("account/RestorePasswordConfirm", data, headers);
  }
};
export default AccountService;
