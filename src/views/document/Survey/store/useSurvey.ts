import { invSurveyMembers } from "./../types";
import { defineStore } from "pinia";
import { GetSurvey, ICompleteResult, ICompleteResultTables, QuestionsSelectList } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { ISelectList } from "@/models/basic";
import { SurveyService } from "../service/Survey.service";
import ManualService from "@/services/others/manual.service.";
import DistrictService from "@/services/info/district.service";
import MfyService from "@/services/info/mfy.service";
import { LocationQuery } from "vue-router";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { CreateSurveyMember } from "../SurveyHelpers";

interface IUseSurvey {
  data: GetSurvey | null;
  parentData: GetSurvey | null;
  loading: boolean;
  saveLoading: boolean;
  searchLoading: boolean;
  questionnaireList: QuestionsSelectList[];
  members: invSurveyMembers[];

  surveyResultActionList: ISelectList[];
  questionnaireTypeList: ISelectList[];
  districtList: ISelectList[];
  mfySelectList: ISelectList[];

  result: ICompleteResult;
  resultData: ICompleteResultTables | null;
  completeSurveyLoading: boolean;
  memberType: boolean;
  familyMembersLoading: boolean;
  showFamilies: boolean;
  isShowFamilies: boolean;
  houseHold: GetSurvey[];
}

const { setError } = useErrorToast();

export const useSurvey = defineStore("survey", {
  state: (): IUseSurvey => ({
    data: null,
    parentData: null,
    loading: false,
    saveLoading: false,
    familyMembersLoading: false,
    showFamilies: false,
    isShowFamilies: false,
    searchLoading: false,
    members: [],
    questionnaireList: [],
    surveyResultActionList: [],
    questionnaireTypeList: [],
    result: {
      surveyId: null,
      surveyAnswers: {},
      surveyResultAlgorithms: []
    },
    houseHold: [],
    resultData: null,
    completeSurveyLoading: false,
    districtList: [] as ISelectList[],
    mfySelectList: [] as ISelectList[],
    memberType: false
  }),
  getters: {
    getData(): GetSurvey | null {
      return this.data;
    },
    getLoading(): boolean {
      return this.loading;
    },
    getSaveLoading(): boolean {
      return this.saveLoading;
    },
    getQuestionnaireList(): QuestionsSelectList[] {
      return this.questionnaireList;
    },
    getSurveyResultActionList(): ISelectList[] {
      return this.surveyResultActionList;
    },
    getQuestionnaireTypeList(): ISelectList[] {
      return this.questionnaireTypeList;
    },
    getResult(): ICompleteResult {
      return this.result;
    },
    getResultData(): ICompleteResultTables | null {
      return this.resultData;
    }
  },
  actions: {
    async setData({
      id,
      err,
      cb,
      query
    }: {
      id?: number | string;
      query?: LocationQuery;
      err?: (e: AxiosError<unknown>) => void;
      cb?: (res?: GetSurvey) => void;
    }) {
      this.data = null;
      this.loading = true;

      const api = query?.surveyId
        ? "Get"
        : query?.surveyCreatedId
        ? "Get"
        : query?.surveyDocId && !query?.createdChild
        ? "GetBySurveyMemberIdForAdditionalFamily"
        : query?.surveyDocId && query?.createdChild
        ? "Get"
        : "Get";

      const inId = query?.surveyDocId && query.createdChild ? id : query?.surveyDocId && !query.createdChild ? query?.surveyDocId : id;

      SurveyService[api](String(inId))
        .then(async (res: AxiosResponse<GetSurvey>) => {
          if ((await CreateSurveyMember(res.data)).length) {
            this.refresh({
              query: query,
              returnId: id
            });
          }

          this.data = res.data;
          if (res.data?.invQuestionnaireTypeId == 1) {
            this.setHouseHold(res.data.subSurveys);
            if (+String(id) == 0) {
              if (this.data) this.data.invSurveyMembers = [];
            }

            this.isShowFamilies = res.data.invSurveyMembers?.every((el: any) => el.surveyId);

            if (res.data.regionId) {
              this.fetchDistrict(res.data.regionId);
            }
            if (res.data.districtId) {
              this.fetchMfy(res.data.districtId);
            }
          }

          if (localStorage.getItem("showFamilies")) {
            this.showFamilies = true;
            localStorage.removeItem("showFamilies");
          }
          if (cb) {
            cb(res.data);
          }
          if (this.members.length) return;
          this.members = res.data.invSurveyMembers;
        })
        .catch((e) => {
          setError(e);
          if (err) {
            err(e);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    setParentData(id: number | string) {
      SurveyService.Get(id).then((res) => {
        this.parentData = res.data;
        this.setHouseHold(res.data.subSurveys);
      });
    },
    setHouseHold(arr: GetSurvey[]) {
      this.houseHold = arr;
    },
    saveData({ cb, err }: { cb: (e: any) => void; err: (e: any) => void }) {
      this.saveLoading = true;
      if (this.data) {
        this.data.logList = [];
        this.data.invSurveyMembers = this.members;
      }

      SurveyService.Update(this.data)
        .then((res) => {
          if (res.status == 200) {
            cb(res.data);
          }
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },

    fetchSurveyMembers(id: number | null) {
      if (!id) return;

      SurveyService.GetInvSurveyMembersByChild(id).then((res: AxiosResponse<invSurveyMembers[]>) => {
        if (!res.data.length) return;

        this.members = res.data.filter((el) => !el.surveyId);

        if (this.data && (!this.data.invSurveyMembers?.length || !this.data.invSurveyMembers)) {
          this.members = res.data;
        }
      });
    },
    setQuestionnaireTypeList() {
      ManualService.GetQuestionnaireTypeSelectList().then((res) => {
        this.questionnaireTypeList = res.data;
      });
    },
    completeSurvey(cb: () => void, err: (e: any) => void, final: () => void) {
      if (!this.data) return;
      SurveyService.Complete({
        id: this.data?.id
      })
        .then(() => {
          cb();
        })
        .catch((e) => {
          err(e);
        })
        .finally(() => {
          final();
        });
    },
    fetchDistrict(val: number | string) {
      if (val) {
        DistrictService.GetAsSelectList(val).then((res) => {
          this.districtList = res.data;
        });
      }
    },
    setDistrict(val: number | string) {
      if (this.data) {
        this.data.mfyId = null;
        this.data.districtId = null;
        this.mfySelectList = [];
        this.districtList = [];
      }
      if (val) {
        DistrictService.GetAsSelectList(val).then((res) => {
          this.districtList = res.data;
        });
      }
    },
    fetchMfy(val: number | string) {
      if (val) {
        MfyService.GetAsSelectList(val).then((res) => {
          this.mfySelectList = res.data;
        });
      }
    },
    setMfy(val: number | string) {
      if (this.data) {
        this.data.mfyId = null;
        this.mfySelectList = [];
      }
      if (val) {
        MfyService.GetAsSelectList(val).then((res) => {
          this.mfySelectList = res.data;
        });
      }
    },
    refresh({ returnId, query }: { returnId: any; query?: LocationQuery }) {
      this.$reset();
      const self = this;
      if (!returnId) return;
      setTimeout(() => {
        this.setData({
          id: String(returnId),
          query: query,
          cb() {
            if (query?.surveyCreatedId || query?.surveyId) {
              self.fetchSurveyMembers(+String(returnId));
            }

            if (self.data?.parentId) {
              self.setParentData(self.data.parentId);
            }
          }
        });
      }, 400);
    }
  }
});
