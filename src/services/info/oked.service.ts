import ApiService from "../api.service";

const OkedService = {
  GetList(data: any) {
    return ApiService.post(`/Oked/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Oked/Get`);
    } else {
      return ApiService.get(`/Oked/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/Oked/Create`, data);
    } else {
      return ApiService.post(`/Oked/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/Oked/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Oked/GetAsSelectList`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/Oked/SaveAsExecel`, data);
  }
};
export default OkedService;
