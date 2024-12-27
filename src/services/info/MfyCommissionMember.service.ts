import ApiService from "../api.service";

const MfyCommissionMemberService = {
  ReloadFromGatewayById(data: any) {
    return ApiService.post(`MfyCommissionMember/ReloadFromGatewayById?mfyId=${data.id}`, {});
  }
};
export default MfyCommissionMemberService;
