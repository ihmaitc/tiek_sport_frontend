import ApiService from "../api.service";
export const QuestionAnswerTemplateService = {
  GetList(data: any) {
    return ApiService.post("/invQuestionAnswerTemplate/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/invQuestionAnswerTemplate/Get");
    } else {
      return ApiService.get(`/invQuestionAnswerTemplate/Get/${id}`);
    }
  },
  GetAsSelectList() {
    return ApiService.get("/invQuestionAnswerTemplate/GetAsSelectList");
  },
  AsTableSelectList(id: number | string) {
    return ApiService.get(`/invQuestionAnswerTemplate/AsTableSelectList/${id}`);
  },
  Delete(id: number | string) {
    return ApiService.post(`/invQuestionAnswerTemplate/Delete/${id}`, {});
  },
  Accept(data: any) {
    return ApiService.post("/invQuestionAnswerTemplate/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/invQuestionAnswerTemplate/Cancel", data);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/invQuestionAnswerTemplate/Update", data);
    } else {
      return ApiService.post("/invQuestionAnswerTemplate/Create", data);
    }
  }
};
