import { DefaultGetData, ILogList, ITranslates } from "@/models/basic";

export interface GetQuestionnaire extends DefaultGetData {
  tableId: number | null;
  statusId: number | null;
  organizationId: number | null;
  status: string;
  organizationName: string;
  invQuestionnaireType: string;
  invQuestionnaireGroups: GetQuestionnaireGroups[];
  translates: ITranslates[];
  logList: ILogList[];
  canAccept: true;
  canEdit: true;
  canCancel: true;
  canDelete: true;
  canSent: true;
  docNumber: string;
  docOn: string;
  title: string;
  details: string;
  invQuestionnaireTypeId: number | null;
  message: string;
  invAlgorithms: IUseQuestionnaireAlgorithm[];
}

export interface GetQuestionnaireGroups {
  invQuestionnaireQuestions: GetQuestionnaireQuestions[];
  id: number | null;
  questionGroupId: number | null;
  orderNumber: number | null;
  title: string;
  groupTitle: string;
  groupDescription: string;
  id2Str: string;
  translates: ITranslates[];
}
export interface GetQuestionnaireQuestions {
  id: number | null;
  questionId: number | null;
  questionAnswerTemplateId: number | null;
  orderNumber: number | null;
  questionText: string;
  hint: string;
  answerTypeId: number | null;
  minLenght: number | null;
  maxLenght: number | null;
  translates: ITranslates[];
  invQuestionnaireAnswers: GetQuestionnaireAnswers[];
  isRequired: boolean;
  isNumber?: boolean;
  id2Str: string;
  minValue: string;
  maxValue: string;
  constraints?: IConstrains[];
  criteriaId?: number | null;
}
export interface GetQuestionnaireAnswers {
  id?: number | null;
  answerId?: number | null;
  questionAnswerTemplateTableId?: number | null;
  orderNumber?: number | null;
  answerText: string;
  translates: ITranslates[];
  id2Str: string;
  ball: number;
  hasText: boolean;
  criteriaValueId?: number | null;
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

export interface IConstrains {
  id: number;
  isAny: boolean;
  conditionedTables: IConstrainsTablesEqual[];
  selectedTables: IConstrainsTablesEqual[];
}

export interface IConstrainsTables {
  id: number;
  invQuestionnaireAnswerId2Str: string;
  invQuestionnaireAnswer: string;
}
export interface IConstrainsTablesEqual extends IConstrainsTables {
  isEqual: boolean;
}

export interface IQuestionnaireSelectList {
  orderCode?: string;
  text: string;
  value: number;
}

export interface IIndexes {
  groupIndex: null | number;
  questionIndex: null | number;
  answerIndex: null | number;
}
