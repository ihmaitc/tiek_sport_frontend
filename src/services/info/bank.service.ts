import ApiService from "../api.service";

const BankService = {
  GetList(data: any) {
    return ApiService.post("api/Bank/GetList", data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("api/Bank/Get");
    } else {
      return ApiService.get(`api/Bank/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`api/Bank/Create`, data);
    } else {
      return ApiService.post(`api/Bank/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`api/Bank/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`api/Bank/GetAsSelectList`);
  }
};
export default BankService;
