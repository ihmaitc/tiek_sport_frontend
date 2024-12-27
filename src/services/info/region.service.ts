import ApiService from "../api.service";

const RegionService = {
  GetList(data: any) {
    return ApiService.post(`/Region/GetList`, data);
  },
  Get(id: any) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Region/Get`);
    } else {
      return ApiService.get(`/Region/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/Region/Create`, data);
    } else {
      return ApiService.post(`/Region/Update`, data);
    }
  },
  Delete(id: any) {
    return ApiService.post(`/Region/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Region/GetAsSelectList`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/Region/SaveAsExecel`, data);
  }
};
export default RegionService;
