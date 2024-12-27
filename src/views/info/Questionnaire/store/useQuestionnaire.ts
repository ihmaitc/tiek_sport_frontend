import { defineStore } from "pinia";
import {
  GetQuestionnaire,
  GetQuestionnaireAnswers,
  GetQuestionnaireGroups,
  GetQuestionnaireQuestions,
  IIndexes,
  IUseQuestionnaireAlgorithm,
  IUseQuestionnaireAlgorithmTables
} from "../types";
import { AxiosError } from "axios";
import { ISelectList } from "@/models/basic";
import { notify } from "@kyvg/vue3-notification";
import i18n from "@/app/config/i18n";
import {
  QUESTIONNAIRE_ALGORITHMS,
  QUESTIONNAIRE_ANSWER,
  QUESTIONNAIRE_ANSWERS,
  QUESTIONNAIRE_ANSWER_ID_2_STR,
  QUESTIONNAIRE_GROUP,
  QUESTIONNAIRE_GROUPS,
  QUESTIONNAIRE_GROUP_ID_2_STR,
  QUESTIONNAIRE_QUESTION,
  QUESTIONNAIRE_QUESTIONS,
  QUESTIONNAIRE_QUESTION_ID_2_STR
} from "../QuestionnaireConstants";
import { useFormatter } from "@/utils/helpers/formatter";
import QuestionnaireComposable from "../composable/useQuestionnaire";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import ManualService from "@/services/others/manual.service.";
import { QuestionAnswerTemplateService } from "@/services/info/QuestionAnswerTemplate.service";
import { ALGORITHMS_KEY } from "@/views/document/Survey/SurveyConstants";

const { fetchGuid } = QuestionnaireComposable();
const { removeItemFromArray } = useFormatter();

interface IUseQuestionnaire {
  data: GetQuestionnaire | null;
  loading: boolean;
  saveLoading: boolean;
  answerTypeSelectList: ISelectList[];
  questionnaireTypeSelectList: ISelectList[];
  questionAnswerTemplate: ISelectList[];
  questionAnswerTemplateSelectList: ISelectList[];
  dynamicScoringCriteriaSelectList: ISelectList[];
  dynamicScoringCriteriaValueSelectList: ISelectList[];

  [QUESTIONNAIRE_GROUPS]: GetQuestionnaireGroups;
  [QUESTIONNAIRE_QUESTIONS]: GetQuestionnaireQuestions;
  [QUESTIONNAIRE_ANSWERS]: GetQuestionnaireAnswers;
  algorithm: IUseQuestionnaireAlgorithm;
  algorithmQuestion: GetQuestionnaireQuestions[];
  algorithmAnswers: GetQuestionnaireAnswers[];
  algorithmTables: IUseQuestionnaireAlgorithmTables;
  selectedQuestionId2Str: string;
  selectedQuestionGroup: GetQuestionnaireGroups | null;
  selectedQuestion: GetQuestionnaireQuestions | null;
  selectedAnswer: GetQuestionnaireAnswers | null;

  indexes: IIndexes;
}

export const useQuestionnaire = defineStore("questionnaire", {
  state: (): IUseQuestionnaire => ({
    data: null,
    loading: false,
    saveLoading: false,
    answerTypeSelectList: [],
    questionnaireTypeSelectList: [],
    questionAnswerTemplate: [],
    questionAnswerTemplateSelectList: [],
    dynamicScoringCriteriaSelectList: [],
    dynamicScoringCriteriaValueSelectList: [],
    [QUESTIONNAIRE_GROUPS]: {
      id: 0,
      orderNumber: 1,
      questionGroupId: 0,
      [QUESTIONNAIRE_QUESTIONS]: [],
      title: "new group",
      translates: [],
      id2Str: "",
      groupDescription: "",
      groupTitle: ""
    },
    [QUESTIONNAIRE_QUESTIONS]: {
      answerTypeId: 0,
      hint: "",
      id: 0,
      orderNumber: 1,
      questionAnswerTemplateId: null,
      questionId: 0,
      [QUESTIONNAIRE_ANSWERS]: [],
      questionText: "",
      translates: [],
      isRequired: false,
      id2Str: "",
      constraints: [],
      maxLenght: null,
      minLenght: null,
      isNumber: false,
      minValue: "",
      maxValue: ""
    },
    [QUESTIONNAIRE_ANSWERS]: {
      answerId: 0,
      answerText: "",
      id: 0,
      orderNumber: 1,
      questionAnswerTemplateTableId: null,
      translates: [],
      id2Str: "",
      ball: 0,
      hasText: false
    },
    algorithm: {
      id: 0,
      isAny: false,
      [QUESTIONNAIRE_QUESTION_ID_2_STR]: "",
      tables: []
    },
    algorithmTables: {
      id: 0,
      isEqual: false,
      [QUESTIONNAIRE_ANSWER_ID_2_STR]: "",
      [QUESTIONNAIRE_QUESTION_ID_2_STR]: "",
      [QUESTIONNAIRE_GROUP_ID_2_STR]: "",
      [QUESTIONNAIRE_ANSWER]: "",
      [QUESTIONNAIRE_QUESTION]: "",
      [QUESTIONNAIRE_GROUP]: ""
    },
    algorithmQuestion: [],
    algorithmAnswers: [],
    selectedQuestionId2Str: "",

    selectedQuestion: null,
    selectedAnswer: null,
    selectedQuestionGroup: null,

    indexes: {
      groupIndex: null,
      questionIndex: null,
      answerIndex: null
    }
  }),
  getters: {
    getData(): GetQuestionnaire | null {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    GetAnswerTypeSelectList(): ISelectList[] {
      return this.answerTypeSelectList;
    },
    GetQuestionnaireTypeSelectList(): ISelectList[] {
      return this.questionnaireTypeSelectList;
    },
    "get${QUESTIONNAIRE_QUESTIONS}"(): GetQuestionnaireQuestions {
      return this[QUESTIONNAIRE_QUESTIONS];
    },
    "get${QUESTIONNAIRE_ANSWERS}"(): GetQuestionnaireAnswers {
      return this[QUESTIONNAIRE_ANSWERS];
    },
    getQuestionAnswerTemplate(): ISelectList[] {
      return this.questionAnswerTemplate;
    },
    getAlgorithm(): IUseQuestionnaireAlgorithm {
      return this.algorithm;
    },
    getAlgorithmTables(): IUseQuestionnaireAlgorithmTables {
      return this.algorithmTables;
    }
  },
  actions: {
    setData({ id, isClone, err, cb }: { err: (e: AxiosError<unknown>) => void; cb: () => void; isClone?: string; id: number | string }) {
      this.loading = true;
      const api = isClone ? "GetCloneById" : "Get";
      QuestionnaireService[api](id)
        .then((res) => {
          this.data = res.data;

          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    setAnswerTypeSelectList() {
      ManualService.GetAnswerTypeSelectList().then((res) => {
        this.answerTypeSelectList = res.data;
      });
    },
    setQuestionTypeList() {
      ManualService.GetQuestionnaireTypeSelectList().then((res) => {
        this.questionnaireTypeSelectList = res.data;
      });
    },
    setQuestionTemplate() {
      QuestionAnswerTemplateService.GetAsSelectList().then((res) => {
        this.questionAnswerTemplate = res.data;
      });
    },
    acceptAnswersFromTemplate(groupIndex: number, questionIndex: number, value: number) {
      if (this.data) {
        const question = this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS][questionIndex];

        if (!question.answerTypeId) {
          question.questionAnswerTemplateId = null;
          notify({
            // @ts-ignore
            text: i18n.global.t("selectAnswerType"),
            type: "warn"
          });
          return;
        }

        QuestionAnswerTemplateService.Get(value).then((res) => {
          question[QUESTIONNAIRE_ANSWERS] = [];

          res.data.tables.forEach(async (element: GetQuestionnaireAnswers) => {
            question[QUESTIONNAIRE_ANSWERS].push({
              answerText: element.answerText,
              translates: element.translates,
              questionAnswerTemplateTableId: element.id,
              orderNumber: element.orderNumber,
              id2Str: await fetchGuid(),
              ball: 0,
              hasText: false
            });
          });
        });
      }
    },
    setDynamicScoringCriteriaSelectList() {
      if (this.dynamicScoringCriteriaSelectList.length) return;
      ManualService.GetScoringCriteriaSelectList().then((res) => {
        this.dynamicScoringCriteriaSelectList = res.data;
      });
    },
    setDynamicScoringCriteriaValueSelectList(criteriaId: number | string) {
      ManualService.GetScoringCriteriaValueSelectList(criteriaId).then((res) => {
        this.dynamicScoringCriteriaValueSelectList = res.data;
      });
    },

    /* ADDING QUESTIONS */

    async convertGroup() {
      return {
        ...this[QUESTIONNAIRE_GROUPS],
        title: "new group",
        id2Str: await fetchGuid()
      };
    },

    async addGroup() {
      const awaitedGroup = await this.convertGroup();
      const group = Object.assign({}, { ...awaitedGroup, [QUESTIONNAIRE_QUESTIONS]: [] });
      this.data?.[QUESTIONNAIRE_GROUPS].push(group);
    },
    deleteGroup(index: number) {
      if (this.data) {
        const existsAlgorithms = this.data[ALGORITHMS_KEY].filter((al) =>
          al.tables.some((t) => t.invQuestionnaireGroupId2Str == this.data?.[QUESTIONNAIRE_GROUPS][index].id2Str)
        );
        console.log(existsAlgorithms);
        existsAlgorithms.forEach((ex) => {
          const ind = this.data?.[ALGORITHMS_KEY].indexOf(ex);
          if (ind !== undefined) {
            this.data?.invAlgorithms.splice(ind, 1);
          }
        });

        this.data[QUESTIONNAIRE_GROUPS].splice(index, 1);
      }
    },
    async addQuestionBeforeAfter(groupIndex: number, index: number | null) {
      if (this.data && index != null) {
        const awaitedQuestion = await this.convertQuestion();
        let question = Object.assign({}, { ...awaitedQuestion, [QUESTIONNAIRE_ANSWERS]: [] });
        this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS].splice(index, 0, question);
      }
    },
    async convertQuestion() {
      return {
        ...this[QUESTIONNAIRE_QUESTIONS],
        questionText: "new question",
        id2Str: await fetchGuid()
      };
    },
    async addQuestion(groupIndex: number) {
      if (this.data) {
        const awaitedQuestion = await this.convertQuestion();
        const group = this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS];
        const newQuestion = await Object.assign({}, { ...awaitedQuestion, [QUESTIONNAIRE_ANSWERS]: [] });
        group.push(newQuestion);
      }
    },

    deleteQuestion(groupIndex: number, questionIndex: number) {
      if (this.data) {
        this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS].splice(questionIndex, 1);
      }
    },

    async addAnswer(groupIndex: number, questionIndex: number) {
      if (this.data) {
        const question = this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS][questionIndex];

        const convertedAnswer = {
          ...this[QUESTIONNAIRE_ANSWERS],
          answerText: "new Answer",
          id2Str: await fetchGuid()
        };

        const newAnswer = Object.assign({}, convertedAnswer);

        question[QUESTIONNAIRE_ANSWERS].push(newAnswer);
      }
    },
    deleteAnswer(groupIndex: number, questionIndex: number, answerIndex: number) {
      if (!this.data) return;
      const question = this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS][questionIndex];

      question[QUESTIONNAIRE_ANSWERS].splice(answerIndex, 1);
    },
    selectAnswerType(groupIndex: number, questionIndex: number, answerType: ISelectList) {
      if (this.data) {
        const question = this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS][questionIndex];
        if (answerType.value === 3 && question.questionAnswerTemplateId) {
          return;
        }

        if (answerType.value === 3) {
          question[QUESTIONNAIRE_ANSWERS] = [];
        }

        this.data[QUESTIONNAIRE_GROUPS][groupIndex][QUESTIONNAIRE_QUESTIONS].splice(questionIndex, 1, {
          ...question,
          answerTypeId: answerType.value
        });
      }
    },

    /* ALGORITHM */
    checkToHasAlgorithm() {
      let index = null;
      if (this.data) {
        this.data[QUESTIONNAIRE_ALGORITHMS].forEach((algorithm, algorithmIndex) => {
          if (algorithm[QUESTIONNAIRE_QUESTION_ID_2_STR] === this.selectedQuestion?.id2Str) {
            return (index = algorithmIndex);
          }
          algorithm.tables.forEach((t) => {
            if (t[QUESTIONNAIRE_QUESTION_ID_2_STR] === this.selectedQuestion?.id2Str) {
              return (index = algorithmIndex);
            }
            if (this.selectedAnswer?.id2Str === t[QUESTIONNAIRE_ANSWER_ID_2_STR]) {
              return (index = algorithmIndex);
            }
          });
        });
      }

      return index;
    },
    saveCondition(value: IUseQuestionnaireAlgorithm[]) {
      if (this.data) {
        let list = [];
        list.push(...this.data[QUESTIONNAIRE_ALGORITHMS], ...value);
        this.data[QUESTIONNAIRE_ALGORITHMS] = [...new Map(list.map((item) => [item[QUESTIONNAIRE_QUESTION_ID_2_STR], item])).values()].filter(
          (el) => el.tables.length
        );
        console.log(value, this.data[QUESTIONNAIRE_ALGORITHMS]);
      }
    },
    deleteQuestionAnswerAlgorithm() {
      if (this.data?.[QUESTIONNAIRE_ALGORITHMS]) {
        if (this.indexes.answerIndex !== null) {
          if (this.indexes.groupIndex !== null && this.indexes.questionIndex !== null) {
            this.deleteAnswer(this.indexes.groupIndex, this.indexes.questionIndex, this.indexes.answerIndex);
          }
        } else {
          if (this.indexes.groupIndex !== null && this.indexes.questionIndex !== null) {
            this.deleteQuestion(this.indexes.groupIndex, this.indexes.questionIndex);
          }
        }
        const index = this.checkToHasAlgorithm();
        if (index !== null) {
          removeItemFromArray(this.data[QUESTIONNAIRE_ALGORITHMS], index);
        }
      }
    },
    clearAlgorithmsOnChangeAnswerTemplate(question: GetQuestionnaireQuestions) {
      question.constraints = [];
      if (this.data && this.data[QUESTIONNAIRE_ALGORITHMS].length > 0) {
        this.data[QUESTIONNAIRE_ALGORITHMS].forEach((algorithm, algorithmIndex) => {
          if (algorithm[QUESTIONNAIRE_QUESTION_ID_2_STR] === question.id2Str) {
            if (this.data) {
              removeItemFromArray(this.data?.[QUESTIONNAIRE_ALGORITHMS], algorithmIndex);
            }
          } else {
            algorithm.tables.forEach((t, tIndex) => {
              if (t[QUESTIONNAIRE_QUESTION_ID_2_STR] === question.id2Str && this.data) {
                removeItemFromArray(algorithm.tables, tIndex);
              }
            });

            if (algorithm.tables.length === 0 && this.data) {
              removeItemFromArray(this.data?.[QUESTIONNAIRE_ALGORITHMS], algorithm);
            }
          }
        });
      }
    },

    // CONSTRAINTS

    /* flush */
    clearQuestion() {
      if (this.data) {
        this[QUESTIONNAIRE_QUESTIONS] = {
          answerTypeId: null,
          hint: "",
          id: 0,
          orderNumber: 1,
          questionAnswerTemplateId: null,
          questionId: null,
          questionText: "",
          translates: [],
          [QUESTIONNAIRE_ANSWERS]: [],
          isRequired: false,
          id2Str: "",
          maxLenght: null,
          minLenght: null,
          isNumber: false,
          minValue: "",
          maxValue: ""
        };
      }
    },
    clearQuestionGroup() {
      if (this.data) {
        this[QUESTIONNAIRE_GROUPS] = {
          id: 0,
          orderNumber: this.data?.[QUESTIONNAIRE_GROUPS].length + 1,
          questionGroupId: 0,
          [QUESTIONNAIRE_QUESTIONS]: [],
          title: "",
          id2Str: "",
          translates: [],
          groupDescription: "",
          groupTitle: ""
        };
      }
    },
    flushAlgorithm() {
      this.algorithm = {
        id: 0,
        isAny: false,
        [QUESTIONNAIRE_QUESTION_ID_2_STR]: "",
        tables: []
      };
    },
    flushAlgorithmTables() {
      this.algorithmTables = {
        id: 0,
        isEqual: false,
        [QUESTIONNAIRE_QUESTION_ID_2_STR]: "",
        [QUESTIONNAIRE_ANSWER_ID_2_STR]: "",
        [QUESTIONNAIRE_GROUP_ID_2_STR]: "",
        [QUESTIONNAIRE_ANSWER]: "",
        [QUESTIONNAIRE_QUESTION]: "",
        [QUESTIONNAIRE_GROUP]: ""
      };
    },

    saveConstraints(value: any[]) {
      if (this.data && this.indexes.groupIndex !== null && this.indexes.questionIndex !== null) {
        this.data[QUESTIONNAIRE_GROUPS][this.indexes.groupIndex][QUESTIONNAIRE_QUESTIONS][this.indexes.questionIndex].constraints = value;
      }
    },

    /* SAVE DATA */
    saveData({ cb, err }: { cb: () => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (this.data) {
        this.data.logList = [];
      }
      QuestionnaireService.Update(this.data)
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    }
  }
});
