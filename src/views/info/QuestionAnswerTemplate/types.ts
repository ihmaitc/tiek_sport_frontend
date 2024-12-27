import { ITranslates } from "@/models/basic";

export interface GetQuestionAnswerTemplate {
  orderNumber: number | null;
  code: string;
  shortName: string;
  fullName: string;
  translates: ITranslates[];
  tables: GetQuestionAnswerTemplateTables[];
  stateId: number | null;
  state: string;
}

export interface GetQuestionAnswerTemplateTables {
  id: number | null;
  answerText: string;
  translates: ITranslates[];
  orderNumber: number;
}
