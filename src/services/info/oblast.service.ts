import ApiService from "../api.service";

const OblastService = {
  GetAll(lang: string) {
    return ApiService.get(`/Oblast/GetAll?lang=${lang}`);
  },
  GetList(Search: string, SortColumn: string, OrderType: string, PageNumber: string | number, PageLimit: string | number) {
    return ApiService.get(
      `/Oblast/GetList?Search=${Search}&SortColumn=${SortColumn}&OrderType=${OrderType}&PageNumber=${PageNumber}&PageLimit=${PageLimit}`
    );
  }
};
export default OblastService;
