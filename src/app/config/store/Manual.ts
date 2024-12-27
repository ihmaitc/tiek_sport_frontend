import { ILanguageList, ISelectList } from "@/models/basic";
import { KinshipDegreeService } from "@/services/info/KinshipDegree.service";
import RegionService from "@/services/info/region.service";
import ManualService from "@/services/others/manual.service.";
import { defineStore } from "pinia";

export const useManualStore = defineStore("manual", {
  state: () => ({
    LanguageList: [] as ILanguageList[],
    regionSelectList: [] as ISelectList[],
    IdentityDocumentSelectList: [] as ISelectList[],
    kinshipDegreeSelectList: [] as ISelectList[],
    stateSelectList: [] as ISelectList[]
  }),
  actions: {
    fetchLanguage() {
      if (this.LanguageList?.length) return;
      ManualService.LanguageSelectList().then((res) => {
        this.LanguageList = res.data;
      });
    },
    fetchRegionSelectList() {
      if (this.regionSelectList?.length) return;
      RegionService.GetAsSelectList().then((res) => {
        this.regionSelectList = res.data;
      });
    },
    fetchIdentityDocumentSelectList() {
      if (this.IdentityDocumentSelectList?.length) return;
      ManualService.IdentityDocumentSelectList().then((res) => {
        this.IdentityDocumentSelectList = res.data;
      });
    },
    fetchKinshipDegreeSelectList() {
      if (this.kinshipDegreeSelectList?.length) return;
      KinshipDegreeService.GetAsSelectList().then((res) => {
        this.kinshipDegreeSelectList = res.data;
      });
    },
    fetchStateSelectList() {
      if (this.stateSelectList?.length) return;
      ManualService.StateSelectList().then((res) => {
        this.stateSelectList = res.data;
      });
    }
  }
});
