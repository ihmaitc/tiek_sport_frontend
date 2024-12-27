import ApiService from "../api.service";

const UserService = {
  GetList(data: any) {
    return ApiService.post(`/User/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/User/Get`);
    } else {
      return ApiService.get(`/User/Get/${id}`);
    }
  },
  GetByPassportData(data: any) {
    return ApiService.get(`/User/GetByPassportData?Seria=${data.Seria}&Number=${data.Number}&DateOfBirth=${data.DateOfBirth}`);
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/User/Create`, data);
    } else {
      return ApiService.post("/User/Update", data);
    }
  },
  CreateByEmployee(data: any) {
    return ApiService.post(`/User/CreateByEmployee`, data);
  },
  CheckUserName(data: any) {
    return ApiService.post(`/User/CreateByEmployee`, data);
  },
  SaveAsExecel(data: any) {
    return ApiService.post(`/User/SaveAsExecel`, data);
  },
  Delete(id: number | string) {
    return ApiService.post(`/User/Delete/${id}`);
  },
  GetAsSelectList(data = {}) {
    return ApiService.post(`/User/GetAsSelectList`, data);
  },
  ChangeUserInfo(data = {}) {
    return ApiService.post(`/User/ChangeUserInfo`, data);
  }
};
export default UserService;
