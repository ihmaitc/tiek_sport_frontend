import ApiService from "../api.service";

const AccountService = {
  GetAsSelectList() {
    return ApiService.get("UserType/GetAsSelectList");
  },
};
export default AccountService;
