import ApiService from "../api.service";

export const KinshipDegreeService = {
  GetAsSelectList() {
    return ApiService.get("KinshipDegree/GetAsSelectList");
  }
};
