import ApiService from "../api.service";

const AppErrorService = {
  GetList(data: any) {
    return ApiService.post("/AppError/GetList", data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/AppError/Get`);
    } else {
      return ApiService.get(`/AppError/Get/${id}`);
    }
  }
};

export default AppErrorService;
