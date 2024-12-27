import ApiService from "../api.service";

const SectorService = {
  GetList(data: any) {
    return ApiService.post(`Sector/GetList`, data);
  },
  GetListByPersonCategory(data: any) {
    return ApiService.post(`Sector/GetListByPersonCategory`, data);
  },
  Get(id: number | string) {
    if (id == 0 || id === null || id === undefined) {
      return ApiService.get(`Sector/Get`);
    } else {
      return ApiService.get(`Sector/Get/${id}`);
    }
  },
  Update(data: any) {
    if (data.id == 0) {
      return ApiService.post(`Sector/Create`, data);
    } else {
      return ApiService.post(`Sector/Update`, data);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`Sector/Delete/${id}`, {});
  },
  GetAsSelectList() {
    return ApiService.get(`Sector/GetAsSelectList`);
  },
  GetAsSelectListId(id: number | string) {
    return ApiService.get(`Sector/GetAsSelectList?sector_id=${id}`);
  }
};
export default SectorService;
