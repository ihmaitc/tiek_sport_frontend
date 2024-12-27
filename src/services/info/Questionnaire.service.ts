import ApiService from "../api.service";

export const QuestionnaireService = {
  GetList(data: any) {
    return ApiService.post("InvQuestionnaire/GetList", data);
  },
  Get(id: number | string) {
    if (!id || id == 0) {
      return ApiService.get("/InvQuestionnaire/Get");
    } else {
      return ApiService.get(`/InvQuestionnaire/Get/${id}`);
    }
  },
  Delete(id: number | string) {
    return ApiService.post(`/InvQuestionnaire/Delete/${id}`, {});
  },
  GetQuestionnaireTemplates(id: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnaireTemplates/${id}`);
  },
  GetCloneById(id: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetCloneById/${id}`);
  },
  GetQuestionnaireSelectList(questionnaireTypeId?: number | string) {
    if (questionnaireTypeId) {
      return ApiService.get(`/InvQuestionnaire/GetQuestionnaireSelectList?questionnaireTypeId=${questionnaireTypeId}`);
    }
    return ApiService.get(`/InvQuestionnaire/GetQuestionnaireSelectList`);
  },
  GetSourceQuestionnaireSelectList(sourceQuestionniareId?: number | string | null, forAlgorithm?: boolean) {
    if (sourceQuestionniareId) {
      return ApiService.get(`/InvQuestionnaire/GetQuestionnaireSelectList?sourceQuestionniareId=${sourceQuestionniareId}`);
    }
    if (forAlgorithm) {
      return ApiService.get(`/InvQuestionnaire/GetQuestionnaireSelectList?forAlgorithm=${forAlgorithm}`);
    }
  },

  GetGuid() {
    return ApiService.get(`/InvQuestionnaire/GetGuid`);
  },
  Sent(id: number | string) {
    return ApiService.post(`/InvQuestionnaire/Sent/${id}`, {});
  },
  Accept(data: any) {
    return ApiService.post("/InvQuestionnaire/Accept", data);
  },
  Cancel(data: any) {
    return ApiService.post("/InvQuestionnaire/Cancel", data);
  },
  GetByIdForSurvey(id: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetByIdForSurvey/${id}`);
  },
  GetQuestionnaireGroups(questionnaireId: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnaireGroups/${questionnaireId}`);
  },
  GetQuestionnaireQuestions(questionnaireId: number | string, questionnaireGroupId: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnaireQuestions/${questionnaireId}/${questionnaireGroupId}`);
  },
  GetQuestionnaireAnswers(questionnaireId: number | string, questionnaireGroupId: number | string, questionnaireQuestionId: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnaireAnswers/${questionnaireId}/${questionnaireGroupId}/${questionnaireQuestionId}`);
  },
  Update(data: any) {
    if (data.id) {
      return ApiService.post("/InvQuestionnaire/Update", data);
    } else {
      return ApiService.post("/InvQuestionnaire/Create", data);
    }
  },
  ExportQuestionnaireGroups(id: any) {
    return ApiService.printTemp(`/InvQuestionnaire/ExportQuestionnaireGroups?questionnaireId=${id}`);
  },
  GetQuestionnaireAsSelectList(ids: any) {
    if (!ids) {
      return ApiService.post(`/InvQuestionnaire/GetQuestionnaireAsSelectList`, { questionnaireTypeIds: [] });
    } else {
      return ApiService.post(`/InvQuestionnaire/GetQuestionnaireAsSelectList`, { questionnaireTypeIds: ids });
    }
  },
  GetQuestionnarieGroupSelectList(id: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnarieGroupSelectList/${id}`);
  },
  GetQuestionnarieQuestionSelectList(id: number | string) {
    return ApiService.get(`/InvQuestionnaire/GetQuestionnarieQuestionSelectList/${id}`);
  },
  UpdateCriteria(data: any) {
    return ApiService.post("/InvQuestionnaire/UpdateCriteria", data);
  }
};
