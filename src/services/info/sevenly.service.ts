import ApiService from "../api.service";

const SevenlyService = {
  GetList(data: any) {
    return ApiService.post(`Sevenly/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`Sevenly/Get`);
    } else {
      return ApiService.get(`Sevenly/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`Sevenly/Create`, data);
    } else {
      return ApiService.post(`Sevenly/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`Sevenly/Delete/${id}`, {});
  },
  GetAsSelectList() {
    return ApiService.get(`Sevenly/GetAsSelectList`);
  }
};
export default SevenlyService;
