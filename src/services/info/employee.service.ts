import ApiService from "../api.service";
const EmployeeService = {
  GetList(data: any) {
    return ApiService.post("/Employee/GetList", data);
  },
  GetListAttestation(data: any) {
    return ApiService.post("/Employee/GetListWithAttestation", data);
  },
  GetAttestationList(id: number | string) {
    return ApiService.get(`/Employee/GetAttestationList/${id}`);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get("/employee/Get");
    } else {
      return ApiService.get(`/employee/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/employee/Create`, data);
    } else {
      return ApiService.post(`/employee/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/employee/Delete/${id}`);
  },
  GetByPassportData(Seria: string, Number: string, DateOfBirth: string) {
    return ApiService.get(`/Employee/GetByPassportData?Seria=${Seria}&Number=${Number}&DateOfBirth=${DateOfBirth}`);
  },
  GetAsSelectList(data: any) {
    return ApiService.post(`/Employee/GetAsSelectList`, data);
  },
  Create(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/Employee/CreateWithUser`, data);
    } else {
      return ApiService.post(`/Employee/UpdateWithUser`, data);
    }
  },
  // CreateWithUser(data) {
  //   return ApiService.post(`/Employee/CreateWithUser`, data);
  // },
  SaveAsExecel1(data: any) {
    return ApiService.printTemp(`/Employee/SaveAsExecel`, data);
  },
  SaveAsExecelKadir(data: any) {
    return ApiService.printTemp(`/Employee/SaveAsExecelKadir`, data);
  },
  MakeHr(id: number | string) {
    return ApiService.post(`/Employee/MakeHr/${id}`);
  },
  MakeInspector(id: number | string) {
    return ApiService.post(`/Employee/MakeInspector/${id}`);
  },
  SaveAsExecel(data: any) {
    return ApiService.printTemp(`/Employee/GetListWithAttestationExcel`, data);
  }
};
export default EmployeeService;
