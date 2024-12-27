import ApiService from "../api.service";

const CountryService = {
  GetList(data: any) {
    return ApiService.post(`/Country/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/Country/Get`);
    } else {
      return ApiService.get(`/Country/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/Country/Create`, data);
    } else {
      return ApiService.post(`/Country/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/Country/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/Country/GetAsSelectList`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/Country/SaveAsExecel`, data);
  }
};
export default CountryService;
