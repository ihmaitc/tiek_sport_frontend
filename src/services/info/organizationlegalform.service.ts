import ApiService from "../api.service";
const OrganizationLegalFormService = {
  GetList(data: any) {
    return ApiService.post(`/OrganizationLegalForm/GetList`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`/OrganizationLegalForm/Get`);
    } else {
      return ApiService.get(`/OrganizationLegalForm/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`/OrganizationLegalForm/Create`, data);
    } else {
      return ApiService.post(`/OrganizationLegalForm/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/OrganizationLegalForm/Delete/${id}`);
  },
  GetAsSelectList() {
    return ApiService.get(`/OrganizationLegalForm/GetAsSelectList`);
  }
};
export default OrganizationLegalFormService;
