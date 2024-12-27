import ApiService from "@/services/api.service";
import { AxiosRequestConfig } from "axios";

export const SurveyService = {
  GetList(data: any) {
    return ApiService.post("InvSurvey/GetList", data);
  },
  GetListV2(data: any) {
    return ApiService.post("InvSurvey/GetListV2", data);
  },
  SxkSkoringGetlist(data: any) {
    return ApiService.post("InvSurvey/SxkSkoringGetlist", data);
  },
  SxkSkoringGetlistV2(data: any) {
    return ApiService.post("InvSurvey/SxkSkoringGetlistV2", data);
  },
  MfyCommissionMemberAcceptedGetList(data: any) {
    return ApiService.post("InvSurvey/MfyCommissionMemberAcceptedGetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/InvSurvey/Get");
    } else {
      return ApiService.get(`/InvSurvey/Get/${id}`);
    }
  },
  DownloadFile(id: number | string) {
    return ApiService.get(`/InvSurvey/DownloadFile/${id}`);
  },
  GetBySurveyMemberId(id: number | string | null) {
    return ApiService.get(`/InvSurvey/GetBySurveyMemberId/${id}`);
  },
  GetBySurveyMemberIdForAdditionalFamily(id: number | string | null) {
    return ApiService.get(`/InvSurvey/GetBySurveyMemberIdForAdditionalFamily/${id}`);
  },
  GetInvSurveyMembersByChild(id: number | string | null) {
    return ApiService.get(`/InvSurvey/GetInvSurveyMembersByChild/${id}`);
  },
  SaveAnswers(data: any, config?: AxiosRequestConfig) {
    return ApiService.post(`/InvSurvey/SaveAnswers`, data, config);
  },
  RemoveAnswer(answerId: number | string, config?: AxiosRequestConfig) {
    return ApiService.post(`/InvSurvey/RemoveAnswer/${answerId}`, {}, config);
  },
  Delete(id: number | string) {
    return ApiService.post(`/InvSurvey/Delete/${id}`, {});
  },
  Sent(data: any) {
    return ApiService.post(`/InvSurvey/SendToMfyCommission`, data);
  },
  CreateIncpectionSurvey(data: any) {
    return ApiService.post(`/InvSurvey/CreateIncpectionSurvey`, data);
  },
  UploadFile(data: any, config?: AxiosRequestConfig) {
    return ApiService.post(`/InvSurvey/UploadFile`, data, config);
  },
  SaveFiles(data: any) {
    return ApiService.post(`/InvSurvey/SaveFiles`, data);
  },
  ResendSMS(data: any) {
    return ApiService.post(`/InvSurvey/ResendSMS`, data);
  },
  Complete(data: any) {
    return ApiService.post(`/InvSurvey/Complete`, data);
  },
  Accept(data: any) {
    return ApiService.post("/InvSurvey/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/InvSurvey/Cancel", data);
  },
  AddSurveyMember(data: any) {
    return ApiService.post("/InvSurvey/AddSurveyMember", data);
  },
  RemoveSurveyMember(data: any) {
    return ApiService.post("/InvSurvey/RemoveSurveyMember", data);
  },
  Update(data: any) {
    return ApiService.post("/InvSurvey/CreateByMobile", data);
  },
  UpdateIsCheckNext(data: any) {
    return ApiService.post("/InvSurvey/UpdateIsCheckNext", data);
  },
  UpdateSurveyMembers(data: any) {
    return ApiService.post("/InvSurvey/UpdateSurveyMembers", data);
  },
  UpdateMfy(data: any) {
    return ApiService.post("/InvSurvey/UpdateMfy", data);
  },
  GetEvaluationPdf(id: number | string) {
    return ApiService.print(`/InvSurvey/GetEvaluationPdf/${id}`);
  },
  UpdateMfyComissionMember(data: any) {
    return ApiService.post(`/InvSurveyApprove/UpdateMfyComissionMember`, data);
  }
};
