import ApiService from "../api.service";

const MfyService = {
  GetList(data: any) {
    return ApiService.post(`mfy/GetList`, data);
  },
  GetAsSelectList(district_id: number | string, sector_id?: number | string) {
    if (sector_id == null || sector_id == 0) {
      return ApiService.get(`mfy/GetAsSelectList?districtId=${district_id}`);
    } else {
      return ApiService.get(`mfy/GetAsSelectList?districtId=${district_id}&sectorId=${sector_id}`);
    }
  },
  GetListByPersonCategory(data: any) {
    return ApiService.post(`mfy/GetListByPersonCategory`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`mfy/Get`);
    } else {
      return ApiService.get(`mfy/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`mfy/Create`, data);
    } else {
      return ApiService.post(`mfy/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`mfy/Delete/${id}`, {});
  },
  ExportGetList(data: any) {
    return ApiService.printTemp(`mfy/ExportGetList`, data);
  }
};
export default MfyService;
