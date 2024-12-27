<script setup lang="ts">
import { IFields, IFilter, ISelectList, ITableActions } from "@/models/basic";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { SurveyService } from "./service/Survey.service";
import { ChartBarIcon, ChecklistIcon, ChecksIcon, GitPullRequestDraftIcon, LayoutGridIcon, SendIcon, XIcon } from "vue-tabler-icons";
import { FormBtn } from "@/models/vuetify/types";
import FormTable from "@/components/form/FormTable.vue";
import { useSurvey } from "./store/useSurvey";
import { storeToRefs } from "pinia";
import { useManualStore } from "@/app/config/store/Manual";
import i18n from "@/app/config/i18n";

interface ICustomFilter extends IFilter {
  questionnaireId: number | null;
  regionId: number | null;
  districtId: number | null;
  mfyId: number | null;
  agreeLetterId: number | null;
  socialEmployeeId: number | null;
  fromDocDate: string;
  toDocDate: string;
  questionnaireTypeId: number | null;
  activity: number | null;
  genderId: number | null;
  stateId: number | null;
  organizationId: number;

  statusIds: number[];
}

const DEFAULT_VALUES: ICustomFilter = {
  orderType: "asc",
  page: 1,
  pageSize: 20,
  search: "",
  totalRows: 0,
  sortBy: "",

  agreeLetterId: null,
  organizationId: 0,
  districtId: null,
  mfyId: null,
  regionId: null,
  questionnaireId: null,
  socialEmployeeId: null,
  questionnaireTypeId: 0,
  activity: 0,
  fromDocDate: "",
  toDocDate: "",
  genderId: null,
  stateId: null,

  statusIds: []
};

const actions: ITableActions = {
  isEdit: true,
  isView: true,
  canAccept: true,
  canCancel: true,
  canDelete: true
};

const fields: IFields[] = [
  { key: "id", label: "id" },
  { key: "docNumber", label: "docNumber" },
  { key: "docOn", label: "docOn" },
  { key: "livingAddress", label: "livingAddress" },
  { key: "applicantPerson", label: "applicantPerson" },
  { key: "AssociatedLeader", label: "AssociatedLeader" },
  { key: "invQuestionnaireType", label: "questionnaireType" },
  {
    key: "totalQuestions",
    label: "totalQuestions",
    tdClass: "text-center",
    thClass: "text-center",
    isAmount: true
  },
  { key: "state", label: "state" },
  { key: "status", label: "status" }
];

const tabs = ref<FormBtn[]>([
  {
    label: "All",
    prependIcon: LayoutGridIcon
  },
  {
    label: "Created",
    prependIcon: GitPullRequestDraftIcon
  },
  {
    label: "Completed",
    color: "success",
    prependIcon: ChecksIcon
  },
  {
    label: "Rejected",
    prependIcon: XIcon,
    color: "error"
  },
  {
    label: "Sent",
    color: "warning",
    prependIcon: SendIcon
  }
]);

const apiTabs = ref<FormBtn[]>([
  {
    label: "SurveyList",
    prependIcon: LayoutGridIcon,
    color: "secondary"
  },
  {
    label: "SxkSkoringGetlist",
    prependIcon: ChartBarIcon,
    color: "info"
  },
  {
    label: "MfyCommissionMemberAcceptedGetList",
    prependIcon: ChecklistIcon,
    color: "success"
  }
]);

const intervierList = ref<ISelectList[]>([
  {
    text: i18n.global.t("All"),
    value: 0
  },
  {
    text: i18n.global.t("socialEmployee"),
    value: 1
  },
  {
    text: i18n.global.t("inspectionEmployee"),
    value: 2
  }
]);

const permission = "Survey";
const routerName = "Survey";

/* IMPORT AND STORE */
const { parseNumber } = useGlobal();

const router = useRouter();
const route = useRoute();
const store = useSurvey();
const manualStore = useManualStore();
const { regionSelectList, stateSelectList } = storeToRefs(manualStore);

const statusId = ref((route.query.status as string) || 0);
const apiId = ref((route.query?.apiIndex as string) || 0);
const apiName = ref((route.query?.apiName as string) || "GetList");
const removeKeys: string[] = ["statusIds"];
const formTableRef = ref<Partial<typeof FormTable>>();

const filter: ICustomFilter = reactive({ ...DEFAULT_VALUES });

const edit = (item: any) => {
  router.push({
    name: `Edit${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const view = (item: any) => {
  router.push({
    name: `View${routerName}`,
    params: {
      id: item.id ? item.id : 0
    }
  });
};

const changeStatus = () => {
  switch (+statusId.value) {
    case 0:
      filter.statusIds = [];
      break;
    case 1:
      filter.statusIds = [1];
      break;
    case 2:
      filter.statusIds = [27];
      break;
    case 3:
      filter.statusIds = [25];
      break;
    case 4:
      filter.statusIds = [8];
      break;
    default:
    // code block
  }
};

const changeAPi = () => {
  switch (+apiId.value) {
    case 0:
      apiName.value = "GetList";
      break;
    case 1:
      apiName.value = "SxkSkoringGetlist";
      break;
    case 2:
      apiName.value = "MfyCommissionMemberAcceptedGetList";
      break;
    default:
    // code block
  }

  setTimeout(() => {
    if (formTableRef.value) {
      formTableRef.value.getData();
    }
  }, 0);
};

const clearFilter = () => {
  Object.assign(filter, DEFAULT_VALUES);
};

const changeRegion = (id: number | string) => {
  filter.districtId = null;
  filter.mfyId = null;
  store.districtList = [];
  store.mfySelectList = [];
  store.setDistrict(id);
};
const changeDistrict = (id: number | string) => {
  filter.mfyId = null;
  store.mfySelectList = [];
  store.setMfy(id);
};

onMounted(() => {
  if (formTableRef.value) {
    formTableRef.value.getData();
  }
  manualStore.fetchRegionSelectList();
  manualStore.fetchStateSelectList();

  if (route.query?.regionId) {
    store.setDistrict(String(route.query?.regionId));
  }
  if (route.query?.districtId) {
    store.setMfy(String(route.query?.districtId));
  }
});
</script>

<template>
  <UiParentCard class="mt-3">
    <filter-page :filter="filter" :removeKeys="removeKeys">
      <template #default="{ createRouteQuery, params, removeKeys }">
        <form-table
          :removeKeys="removeKeys"
          :params="params"
          @create-route-query="createRouteQuery"
          :service="SurveyService"
          :fields="fields"
          :filter="filter"
          :routerName="routerName"
          :permission="permission"
          prepend-action
          :api-name="apiName"
          :identifier="false"
          ref="formTableRef"
        >
          <template #header="{ refresh, getData }">
            <form-table-header
              @getData="getData"
              :filter="filter"
              :permission="permission"
              @refresh="refresh"
              @edit="edit"
              @clearFilter="clearFilter"
              has-menu
            >
              <template #menu-items>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" class="py-1">
                      <form-select
                        :list="regionSelectList"
                        v-model:model-value="filter.regionId"
                        :label="$t('region')"
                        @update:model-value="changeRegion"
                      >
                      </form-select>
                    </v-col>
                    <v-col cols="12" class="py-1">
                      <form-select
                        :list="store.districtList"
                        v-model:model-value="filter.districtId"
                        :label="$t('district')"
                        @update:model-value="changeDistrict"
                      >
                      </form-select>
                    </v-col>
                    <v-col cols="12" class="py-1">
                      <form-select :list="store.mfySelectList" v-model:model-value="filter.mfyId" :label="$t('mfy')"> </form-select>
                    </v-col>

                    <v-col cols="12" class="py-1" v-if="+route.params.id !== 0">
                      <form-select :list="stateSelectList" v-model:modelValue="filter.stateId" :label="$t('status')"></form-select>
                    </v-col>
                    <v-col cols="12" class="py-1">
                      <v-label class="mb-2 font-weight-medium">{{ $t("AssociatedLeader") }}</v-label>
                      <v-select
                        v-model="filter.organizationId"
                        item-title="text"
                        :items="intervierList"
                        hide-details
                        :placeholder="$t('AssociatedLeader')"
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12" class="py-1">
                      <v-label class="mb-2 font-weight-black"> {{ $t("docOn") }} </v-label>
                      <PeriodDate v-model:start-date="filter.fromDocDate" v-model:end-date="filter.toDocDate"></PeriodDate>
                    </v-col>
                  </v-row>
                </v-card-text>
              </template>
              <template #header-bottom>
                <v-row>
                  <v-col>
                    <form-toggle-buttons
                      :tabs="tabs"
                      border
                      divided
                      v-model="statusId"
                      @update:model-value="
                        () => {
                          changeStatus();
                          refresh();
                          createRouteQuery({ filter, params: { status: statusId }, removeKeys });
                        }
                      "
                    />
                  </v-col>
                  <v-spacer />
                  <v-col class="text-right">
                    <form-toggle-buttons
                      :tabs="apiTabs"
                      border
                      divided
                      v-model="apiId"
                      @update:model-value="
                        () => {
                          changeAPi();
                          createRouteQuery({ filter, params: { apiId: apiId }, removeKeys });
                        }
                      "
                    />
                  </v-col>
                </v-row>
              </template>
            </form-table-header>
          </template>
          <template #livingAddress="{ item }">
            <span>
              <h4>{{ $t("region") }}:</h4>
              {{ item.region }}
            </span>
            <span class="my-2 d-block">
              <h4>{{ $t("district") }}:</h4>
              {{ item.district }}
            </span>
            <span>
              <h4>{{ $t("mfy") }}:</h4>
              {{ item.mfy }}</span
            >
          </template>
          <template #AssociatedLeader="{ item }">
            {{ item.organizationId == 1 ? $t("socialEmployee") : $t("inspectionEmployee") }}
          </template>
          <template #startAt="{ item }">
            {{ item.startAt || "-" }} /
            {{ item.endAt || "-" }}
          </template>
          <template #totalQuestions="{ item }">
            {{ parseNumber(item.answeredQuestions) }}
            /
            {{ parseNumber(item.totalQuestions) }}
          </template>
          <template #prepend-action="{ item, getData }">
            <form-table-actions
              :item="item"
              :actions="actions"
              :service="SurveyService"
              :permission="permission"
              @refresh="getData"
              @edit="edit"
              @view="view"
              show-status-actions
            >
            </form-table-actions>
          </template>
        </form-table>
      </template>
    </filter-page>
  </UiParentCard>
</template>
<style scoped lang="scss">
.tabs {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.3125rem;
  width: 100%;
  flex: 0 0 100%;
}
</style>
