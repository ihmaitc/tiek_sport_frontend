import ApiService from "../api.service";
const PersonCategoryService = {
  GetList(data: any) {
    return ApiService.post("/PersonCategory/GetList", data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/PersonCategory/Get");
    } else {
      return ApiService.get(`/PersonCategory/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/PersonCategory/Create`, data);
    } else {
      return ApiService.post(`/PersonCategory/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/PersonCategory/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/PersonCategory/GetAsSelectList`);
  }
};
export default PersonCategoryService;
