import ApiService from "../api.service";

const ManualService = {
  GetModuleSelectList() {
    return ApiService.get("manual/GetModuleSelectList");
  },
  StateSelectList() {
    return ApiService.get("manual/StateSelectList");
  },
  LanguageSelectList() {
    return ApiService.get("manual/LanguageSelectList");
  },
  GenderSelectList() {
    return ApiService.get("manual/GenderSelectList");
  },
  GetAnswerTypeSelectList() {
    return ApiService.get("manual/GetInvAnswerTypeSelectList");
  },
  GetQuestionnaireTypeSelectList() {
    return ApiService.get("manual/GetInvQuestionnaireTypeSelectList");
  },
  NotificationTypeSelectList() {
    return ApiService.get("manual/NotificationTypeSelectList");
  },
  StatusSelectList() {
    return ApiService.get("manual/StatusSelectList");
  },
  IdentityDocumentSelectList() {
    return ApiService.get("manual/IdentityDocumentSelectList");
  },
  SignOrganizationTypeSelectList(data = {}) {
    return ApiService.post(`manual/SignOrganizationTypeSelectList?incluceBusinessman`, data);
  },
  GetListByDocumentId(tableId: number | string, docId: number | string) {
    return ApiService.get(`DocumentChangeLog/GetListByDocumentId/${tableId}/${docId}`);
  },
  GetSurveyApproveDecisionSelectList() {
    return ApiService.get("manual/GetSurveyApproveDecisionSelectList");
  },
  GetSurveyApproveDecisionReasonSelectList(id: number | string) {
    return ApiService.get(`manual/GetSurveyApproveDecisionReasonSelectList/${id}`);
  },
  ValueConcatenationTypeSelectList() {
    return ApiService.get(`manual/ValueConcatenationTypeSelectList`);
  },
  PanelTypeSelectList() {
    return ApiService.get(`manual/PanelTypeSelectList`);
  },
  PortretTypeSelectList() {
    return ApiService.get(`manual/PortretTypeSelectList`);
  },
  GetScoringCriteriaSelectList() {
    return ApiService.get(`manual/GetScoringCriteriaSelectList`);
  },
  GetScoringCriteriaValueSelectList(criteriaId: number | string) {
    return ApiService.get(`manual/GetScoringCriteriaValueSelectList?criteriaId=${criteriaId}`);
  }
};
export default ManualService;
