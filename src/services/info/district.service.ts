import ApiService from "../api.service";
const DistrictService = {
  GetList(data: any) {
    return ApiService.post(`/District/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/District/Get`);
    } else {
      return ApiService.get(`/District/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/District/Create`, data);
    } else {
      return ApiService.post(`/District/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/District/Delete/${id}`, {});
  },
  GetAsSelectList(id: number | string) {
    return ApiService.get(`/District/GetAsSelectList?regionId=${id}`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/District/SaveAsExecel`, data);
  }
};
export default DistrictService;
