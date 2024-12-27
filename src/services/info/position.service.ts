import ApiService from "../api.service";
const PositionService = {
  GetList(data: any) {
    return ApiService.post(`/Position/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Position/Get`);
    } else {
      return ApiService.get(`/Position/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/Position/Create`, data);
    } else {
      return ApiService.post(`/Position/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/Position/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Position/GetAsSelectList`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/Position/SaveAsExecel`, data);
  }
};
export default PositionService;
