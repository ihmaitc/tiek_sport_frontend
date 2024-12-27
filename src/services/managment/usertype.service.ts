import ApiService from "../api.service";

const UserTypeService = {
  GetList(data: any) {
    return ApiService.post("/UserType/GetList", data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`UserType/Get`);
    } else {
      return ApiService.get(`UserType/Get/${id}`);
    }
  },
  GetAsSelectList() {
    return ApiService.get("/UserType/GetAsSelectList");
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/UserType/Create`, data);
    } else {
      return ApiService.post(`/UserType/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/UserType/Delete/${id}`);
  },
  GetSecurityInfo() {
    return ApiService.get(`/UserType/GetSecurityInfo`);
  }
};

export default UserTypeService;
