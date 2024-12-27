import ApiService from "@/services/api.service";

export const InvSurveyComparisionService = {
  GetResut(data: any) {
    return ApiService.post("InvSurveyComparision/GetResut", data);
  },
  SetCommit(data: any) {
    return ApiService.post("InvSurveyComparision/SetCommit", data);
  }
};
