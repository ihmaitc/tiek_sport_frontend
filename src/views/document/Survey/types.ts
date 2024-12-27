import { DefaultGetData, ILogList, IPerson, ISelectList } from "@/models/basic";
export interface QuestionsSelectList extends ISelectList {
  isChecked: boolean;
}
export interface GetSurvey extends DefaultGetData {
  region: string;
  invSurveyGroups: GetGroup[];
  logList: ILogList[];
  tableId: number | null;
  statusId: number | null;
  organizationId: number | null;
  status: string;
  organization: string;
  invQuestionnaire: string;
  docNumber: string;
  docOn: string;
  details: string;
  apartment: string;
  street: string;
  house: string;
  invQuestionnaireId: number | null;
  districtId: number | null;
  invSurveyMembers: invSurveyMembers[];
  mfyId: number | null;
  regionId: number | null;
  startAt: string | null;
  endAt: string | null;
  realStartAt: string | null;
  realEndAt: string | null;
  invAlgorithms: IUseQuestionnaireAlgorithm[];
  invQuestionnaireTypeId: number;
  forDocId: number;
  forTableId: number;
  countOfCompletedFamilyMembers: number;
  countOfFamilyMembers: number;
  applicantPerson: IPerson | null;
  applicantPhoneNumber: string | null;
  parentId: number | null;
  address: IAddress;
  canCompare: boolean;
  isCheckNext: boolean;
  canComplete: boolean;
  subSurveys: GetSurvey[];
  sxkSkoringResult: SxkSkorintResult[];
  approveDecisionReasons: string[];
  invSurveyApprove: any;
  files: IDataFiles[];
  srScoringResult: any;
  canAddAnotherFamily: boolean;
  canAddAdditionalFamily: boolean;
  canSurveyMemberUpdate: boolean;
  canUpdateMfyComissionMember: boolean;
  canEdit: boolean;
  canCompareGetResult: boolean;
}

export interface IDataFiles {
  id: string;
  fileName: string;
  fileSize: number | null;
  ownerId?: number;
}

export interface IFIles {
  fileId: string;
  fileName: string;
  fileSize: number | null;
}

export interface SxkSkorintResult {
  id: number;
  ownerId: number;
  integrationCriteriaId: number;
  isSuccess: boolean;
  errorMessage: string;
  owner: number | null;
}

export interface invSurveyMembers {
  id?: number | null;
  kinshipDegreeId?: number | null;
  kinshipDegree?: string | null;
  isCheckNext?: boolean;
  surveyId?: number | null;
  ownerId?: number | null;
  addingFamily?: number | null;
  person: IPerson | null;
}

export interface IUseQuestionnaireAlgorithm {
  id: number | null;
  invQuestionnaireQuestionId2Str: string;
  isAny: boolean;
  tables: IUseQuestionnaireAlgorithmTables[];
}

export interface IUseQuestionnaireAlgorithmTables {
  id: number | null;
  invQuestionnaireQuestionId2Str: string;
  invQuestionnaireQuestion: string;
  invQuestionnaireAnswerId2Str: string;
  invQuestionnaireAnswer: string;
  invQuestionnaireGroupId2Str: string;
  invQuestionnaireGroup: string;
  isEqual: boolean;
}

export interface GetGroup {
  invSurveyQuestions: GetQuestions[];
  id: number;
  invQuestionnaireGroupId: number | null;
  title: string;
  invQuestionnaireGroupId2: string;
  invQuestionnaireGroupTitle: string;
  invQuestionnaireGroupDescription: string;
}
export interface GetQuestions {
  answerType: string;
  hint: string;
  answerTypeId: number;
  isAnswered: boolean;
  invQuestionAnswerTemplateId: number | null;
  questionText: string;
  id: number;
  invQuestionnaireQuestionId: number | null;
  invSurveyAnswers: GetAnswers[];
  isRequired?: boolean;
  isNumber?: boolean;
  isVisible?: boolean;
  invQuestionnaireQuestionId2: string;
  minLenght?: string | number | null | undefined;
  maxLenght: string | number | null | undefined;
  minValue?: string | number | null | undefined;
  maxValue: string | number | null | undefined;
  constraints: ISurveyConstrains[];
  unAnswered?: boolean | undefined;
}

export interface GetAnswers {
  answerText?: string | null;
  id: number | null;
  isChecked?: boolean;
  invQuestionAnswerTemplateTableId?: number | null;
  invQuestionnaireAnswerId?: number | null;
  textAnswer: string | null;
  invQuestionnaireAnswerId2: string;
  isDisabled: boolean;
  hasText: boolean;
  ball: number;
}

export interface GetAgreeLetterSelectList {
  agreeLetterId: number | null;
  orderCode?: number | string | null;
  person: IPerson;
  socialEmployee: IPerson;
  text?: string | null;
  value?: number | string;
}

export interface ICompleteResult {
  surveyId: number | null;
  surveyAnswers: any;
  surveyResultAlgorithms: any[];
}
export interface IAddress {
  id: number;
  isTemporary: boolean;
  livingAddress: string;
  livingDistrict: string;
  livingDistrictId: number;
  livingMfy: string;
  livingMfyId: number;
  livingRegion: string;
  livingRegionId: number | null;
  temporaryAddress: string | null;
  temporaryDistrict: string | null;
  temporaryDistrictId: number | null;
  temporaryMfy: string | null;
  temporaryMfyId: number | null;
  temporaryRegion: string | null;
  temporaryRegionId: number | null;
  temporaryResidenceType: string | null;
  temporaryResidenceTypeId: number | null;
}

export interface ICompleteResultTables {
  id: number | null;
  canEdit: boolean;
  canAccept: boolean;
  canCancel: boolean;
  canDelete: boolean;
  docNumber: string;
  docOn: string;
  details: string;
  surveyId: number;
  tables: ICompleteResultGetInfoTables[];
}

export interface ICompleteResultGetInfoTables {
  person: string;
  surveyResultAction: string;
  questionnaireType: string;
  applicationType: string;
  id: number;
  personId: number | null;
  surveyResultActionId: number | null;
  questionnaireTypeId: number | null;
  applicationTypeId: number | null;
  feedback: string;
  nextSurveyId: number | null;
  nextApplicationId: number | null;
}

export interface ISurveyConstrains {
  id: number;
  isAny: boolean;
  conditionedTables: ISurveyTablesEqual[];
  selectedTables: ISurveyTablesEqual[];
}

export interface ISurveyConstrainsTables {
  id: number;
  invQuestionnaireAnswerId2Str: string;
  invQuestionnaireAnswer: string;
}
export interface ISurveyTablesEqual extends ISurveyConstrainsTables {
  isEqual: boolean;
}
