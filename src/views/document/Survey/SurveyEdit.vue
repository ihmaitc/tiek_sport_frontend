<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useSurvey } from "./store/useSurvey";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { SubmitEventPromise } from "vuetify";
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { VForm } from "vuetify/components";
import { ALGORITHMS_KEY, GROUPS_KEY } from "./SurveyConstants";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { XIcon, ArrowRightIcon, PlusIcon, ArrowLeftIcon } from "vue-tabler-icons";
import NextSurvey from "./widgets/NextSurvey.vue";
import AdditionalFamily from "./widgets/AdditionalFamily.vue";
import { useManualStore } from "@/app/config/store/Manual";
import SxkSkorintResult from "./widgets/SxkSkorintResult.vue";
import ApproveDecisionReasons from "./widgets/ApproveDecisionReasons.vue";
import { useQuestionnaireValidation } from "./widgets/Questionnaire/useQuestionnaireValidation";
import InvSurveyApprove from "./widgets/InvSurveyApprove.vue";
import { SurveyService } from "./service/Survey.service";
import VCustomFileUpload from "@/components/VCustomFileUpload.vue";
import { IDataFiles } from "./types";
import FancyBox from "@/components/FancyBox.vue";
import { useAppUrl } from "@/composables/useAppUrl";

const { t } = useI18n();
const store = useSurvey();
const manualStore = useManualStore();
const { regionSelectList } = storeToRefs(manualStore);
const { data, districtList, mfySelectList, saveLoading, members, loading, familyMembersLoading, showFamilies, isShowFamilies } = storeToRefs(store);
const { setError } = useErrorToast();
const { API_URL } = useAppUrl();
const refreshImageUrls = ref<boolean>(false);

const { checkAllQuestionsAnswered } = useQuestionnaireValidation();

const router = useRouter();
const route = useRoute();

// const nextRef = ref<Partial<typeof NextSurvey>>();

const isComplete = ref<boolean>(false);
const surveyMemberUpdateLoading = ref<boolean>(false);
const isCompleteLoading = ref<boolean>(false);
const onFirstLoading = ref<boolean>(true);
const selectedTab = ref<number>(0);
const formRef = ref<Partial<typeof VForm>>();
const surveyId = computed(() => route.query.surveyId);

const detectChildSurveyCreated = () => {
  if (route.query.surveyDocId && route.query.createdChild) {
    return { surveyDocId: route.query.surveyDocId, createdChild: "true" };
  }
  return undefined;
};

const canComplete = computed(() => {
  if (data.value && members.value.length) {
    const isComplete = members.value.every((el) => el.isCheckNext);
    return isComplete;
  }
  return data.value?.canComplete;
});

const canCreate = computed(() => {
  if (data.value && data.value.id) {
    return false;
  }
  return true;
});

const dataId = computed(() => {
  if (route.query?.surveyId) {
    return route.query.surveyId;
  } else if (route.query?.surveyCreatedId) {
    return route.query.surveyCreatedId;
  } else if (route.params?.id) {
    return route.params.id;
  } else {
    return null;
  }
});

const tabs = shallowRef([
  {
    title: "docPage",
    component: defineAsyncComponent(() => import("./widgets/Doc.vue")),
    icon: "",
    isVisible: true
  },
  {
    title: "questions",
    component: defineAsyncComponent(() => import("./widgets/Questionnaire/QuestionnaireGroups.vue")),
    icon: "",
    isVisible: !!data.value?.startAt
  }
]);

const checkStarted = () => {
  tabs.value.forEach((el) => {
    if (el.title == "questions") {
      if (Object.keys(route.query).length) {
        el.isVisible = false;
      } else {
        if (data.value) {
          if ([4].includes(data.value.invQuestionnaireTypeId)) {
            el.isVisible = false;
          } else {
            el.isVisible = !!data.value.startAt;
          }
        }
      }
    }
  });
};

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;

  const submitType = (submit.submitter as HTMLInputElement).value;

  if (errors && errors.length > 0) {
    document.getElementById(String(errors[0].id))?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center"
    });
  }

  if (valid && data.value) {
    store.saveData({
      cb(res) {
        notify({
          text: t("SaveSuccess"),
          type: "success"
        });
        if (submitType == "create") {
          const query = route.query.surveyId
            ? { surveyCreatedId: res.id }
            : route.query.surveyDocId
            ? { ...route.query, createdChild: "true" }
            : undefined;

          const resId = route.query.surveyDocId
            ? res.id
            : route.query.surveyCreatedId
            ? res.id
            : route.query.surveyId
            ? route.query.surveyId
            : res.id;

          saveLoading.value = true;

          saveLoading.value = false;
          router.push({
            name: "EditSurvey",
            params: {
              id: resId
            },
            query: { ...query, ...detectChildSurveyCreated() }
          });

          setTimeout(() => {
            store.refresh({
              returnId: dataId.value,
              query: route.query
            });
          }, 300);
        } else {
          router.push({ name: "Survey" });
        }
      },
      err(e) {
        setError(e);
      }
    });
  }
};

const completeSurvey = () => {
  if (data.value) {
    checkAllQuestionsAnswered({
      data: data.value,
      questionnaireTypeId: [1]
    })
      .then((res) => {
        if (res) {
          if (data.value && [1].includes(data.value?.invQuestionnaireTypeId)) {
            if (data.value && data.value.files.length < 2) {
              notify({
                text: t(`minFileCount`, {
                  count: 2
                }),
                type: "warn"
              });
              return;
            }
          }
          isCompleteLoading.value = true;

          store.completeSurvey(
            () => {
              isComplete.value = false;
              notify({
                text: t("completedSuccess"),
                type: "success"
              });
              router.push({ name: "ViewSurvey", params: { id: data.value?.id } });
            },
            (e) => {
              setError(e);
            },
            () => {
              isComplete.value = false;
              isCompleteLoading.value = false;
            }
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const createAdditionSurvey = () => {
  router.push({
    name: "EditSurvey",
    params: { id: 0 },
    query: { surveyDocId: data.value?.id }
  });

  showFamilies.value = false;

  store.$reset();
  loading.value = true;
  router.afterEach(() => {
    setTimeout(() => {
      store.refresh({
        returnId: dataId.value,
        query: route.query
      });
    }, 400);
  });
};

const goHouseHoldQuestions = () => {
  if (localStorage.getItem("houseHold")) {
    localStorage.setItem(
      "houseHold",
      JSON.stringify({
        id: data.value?.parentId,
        status: "open"
      })
    );

    router.push({
      name: "EditSurvey",
      params: { id: data.value?.parentId },
      query: route.query
    });

    store.refresh({
      returnId: data.value?.parentId,
      query: route.query
    });
  } else {
    selectedTab.value = 1;
  }
};

const updateMfy = () => {
  if (!data.value?.id) return;
  SurveyService.UpdateMfy({
    id: data.value?.id,
    mfyId: data.value?.mfyId
  }).then(() => {
    notify({
      text: t("MfySuccessChanged"),
      type: "success"
    });
  });
};

const saveFiles = () => {
  refreshImageUrls.value = true;
  SurveyService.SaveFiles(data.value)
    .then(() => {})
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      refreshImageUrls.value = false;
    });
};

const getFile = (file: IDataFiles) => {
  if (refreshImageUrls.value) {
    return "";
  }
  return `${API_URL.value}InvSurvey/DownloadFile/${file.id}`;
};

const surveyMemberUpdate = () => {
  surveyMemberUpdateLoading.value = true;
  SurveyService.UpdateSurveyMembers({ id: data.value?.id })
    .then(() => {
      store.setData({
        id: data.value?.id
      });
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      surveyMemberUpdateLoading.value = false;
    });
};

window.addEventListener("popstate", (e) => {
  if (selectedTab.value == 1) return;

  if (onFirstLoading.value) {
    return;
  }

  store.$reset();
  loading.value = true;
  selectedTab.value = 0;

  setTimeout(() => {
    if (dataId.value) {
      store.refresh({
        returnId: dataId.value,
        query: route.query
      });
    }
  }, 400);
});

watch(
  () => data.value,
  (val) => {
    if (val) {
      checkStarted();
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => data.value,
  () => {
    if (data.value && data.value.invQuestionnaireTypeId == 1 && data.value.invSurveyMembers && data.value.invSurveyMembers.length) {
      const isExist = data.value.invSurveyMembers.every((el) => el.surveyId);

      if (isExist) {
        showFamilies.value = true;
      }
      if (localStorage.getItem("houseHold")) {
        const storageHouseHold = JSON.parse(localStorage.getItem("houseHold") || "[]");
        localStorage.removeItem("houseHold");

        if (storageHouseHold?.id && storageHouseHold?.status == "open") {
          showFamilies.value = false;
          selectedTab.value = 1;
        }
      }
    }
  }
);

onMounted(() => {
  store.refresh({
    returnId: dataId.value,
    query: route.query
  });
  onFirstLoading.value = false;
  manualStore.fetchRegionSelectList();
});

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <VDialogTransition>
      <UiParentCard v-if="store.getLoading" class="text-center">
        <v-progress-circular indeterminate></v-progress-circular>
      </UiParentCard>
    </VDialogTransition>
    <VDialogTransition mode="out-in" leave-absolute>
      <v-form v-if="!loading && data" @submit.prevent="saveData" ref="formRef">
        <ui-parent-card v-if="data.invQuestionnaireTypeId == 1 && selectedTab !== 1">
          <v-row>
            <v-col lg="4" md="6" cols="12">
              <form-select
                v-model="data.regionId"
                :list="regionSelectList"
                :label="$t('region')"
                required
                :disabled="!!data.regionId"
                @update:model-value="store.setDistrict"
              ></form-select>
            </v-col>
            <v-col lg="4" md="6" cols="12">
              <form-select
                v-model="data.districtId"
                :list="districtList"
                :label="$t('district')"
                required
                :disabled="!!data.districtId"
                @update:model-value="store.setMfy"
              ></form-select>
            </v-col>
            <v-col lg="4" md="6" cols="12">
              <form-select v-model="data.mfyId" :list="mfySelectList" :label="$t('mfy')" required @update:model-value="updateMfy"></form-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col lg="4" md="6" cols="12">
              <form-input :label="$t('street')" v-model:model-value="data.street"></form-input>
            </v-col>
            <v-col lg="4" md="6" cols="12">
              <form-input :label="$t('house')" v-model:model-value="data.house" type="number"></form-input>
            </v-col>
            <v-col lg="4" md="6" cols="12">
              <form-input :label="$t('apartment')" v-model:model-value="data.apartment" type="number"></form-input>
            </v-col>
          </v-row>
        </ui-parent-card>

        <v-window class="mt-4" v-model:modelValue="selectedTab">
          <v-window-item v-for="(tab, _) in tabs" :value="tab.title">
            <component
              :is="tab.component"
              v-model:data="data[GROUPS_KEY]"
              :algorithms="data[ALGORITHMS_KEY]"
              :end-at="data.endAt"
              @start="checkStarted"
            >
              <ui-parent-card class="mt-4" v-if="[1].includes(data.invQuestionnaireTypeId) && data.files">
                <VCustomFileUpload
                  required
                  :service="SurveyService"
                  v-model:files="data.files"
                  form-data-key="file"
                  :label="$t('fileUpload')"
                  :max-file-count="10"
                  :min-file-count="2"
                  multiple
                  :upload-options="{
                    ownerId: data.id
                  }"
                  @update:files="saveFiles"
                  @delete-file="saveFiles"
                />
              </ui-parent-card>

              <ui-parent-card v-if="data.files?.length" class="mt-4">
                <h2 class="mb-4">{{ $t("uploadedFiles") }}</h2>
                <FancyBox>
                  <div class="d-flex flex-wrap ga-2">
                    <div v-for="file in data.files" class="img">
                      <a data-fancybox="gallery" :href="getFile(file)">
                        <v-img :src="getFile(file)" :alt="file.fileName" />
                      </a>
                    </div>
                  </div>
                </FancyBox>
              </ui-parent-card>
            </component>
          </v-window-item>
        </v-window>

        <SxkSkorintResult class="mt-4" />
        <InvSurveyApprove class="mt-4" />
        <ApproveDecisionReasons class="mt-4" />

        <v-row class="mt-4 px-3 ga-2 row">
          <v-btn
            :text="$t('Back')"
            color="error"
            @click="
              router.push({
                name: 'Survey'
              })
            "
          />
          <v-spacer class="d-block d-xs-none" />

          <NextSurvey v-if="selectedTab !== 1" :returnId="dataId" v-model:selected-tab="selectedTab" />

          <v-btn class="mr-1" v-if="selectedTab == 1" @click="selectedTab = 0" :prepend-icon="ArrowLeftIcon" :text="$t('docPage')" color="info" />

          <v-dialog v-if="selectedTab == 0" width="600" scrollable v-model:model-value="showFamilies">
            <template #activator="{ props }">
              <v-btn v-if="!surveyId && route.params.id !== '0' && isShowFamilies" v-bind="props" color="violet">
                {{ $t("additionFamily") }}
                <ArrowRightIcon class="ml-1" size="20" />
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                <h4>{{ $t("SurveyFamilies") }}</h4>
              </v-card-title>

              <v-card-text>
                <AdditionalFamily v-model:selected-tab="selectedTab" />
                <div class="d-flex align-center justify-center" v-if="!data.parentId && data.canAddAnotherFamily">
                  <div class="w-max border pa-2 d-flex align-center cursor-pointer justify-center rounded" @click="createAdditionSurvey()">
                    <PlusIcon size="24" color="rgb(var(--v-theme-info))" />
                    <span class="ml-1">{{ $t("addNewFamilyMember") }}</span>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn color="error" @click="showFamilies = false">{{ $t("close") }}</v-btn>
                <v-btn color="info" @click="goHouseHoldQuestions">{{ $t("goSurveyQuestions") }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="isComplete" width="450" v-if="data?.invQuestionnaireTypeId == 1">
            <template #activator="{ props }">
              <v-btn v-if="canComplete" :text="$t('completeSurvey')" color="success" v-bind="props" />
            </template>
            <v-card class="pa-5" height="100%">
              <v-card-title>
                <v-row>
                  <v-col> </v-col>
                  <v-col class="text-right py-0">
                    <XIcon @click="isComplete = false" class="cursor-pointer" />
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <h3 class="text-center font-weight-bold">
                  {{ $t("areUComplete") }}
                </h3>
                <v-row class="mt-2">
                  <v-col cols="6">
                    <v-btn :text="$t('no')" variant="flat" color="error" :loading="isCompleteLoading" class="w-100" @click="isComplete = false" />
                  </v-col>
                  <v-col cols="6">
                    <v-btn :text="$t('yes')" variant="flat" color="success" :loading="isCompleteLoading" class="w-100" @click="completeSurvey" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            class="mr-1"
            v-if="data?.canSurveyMemberUpdate"
            :text="$t('surveyMemberUpdate')"
            color="success"
            @click="surveyMemberUpdate"
            :loading="surveyMemberUpdateLoading"
          />
          <v-btn
            class="mr-1"
            v-if="canCreate"
            :text="$t('createSurvey')"
            color="success"
            type="submit"
            value="create"
            :loading="saveLoading || familyMembersLoading"
          />
        </v-row>
      </v-form>
    </VDialogTransition>
  </div>
</template>
<style lang="scss">
.v-card-title {
  white-space: pre-wrap;
}

.img {
  width: 200px;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
  border: thin solid #e0e0e0;
  padding: 4px;
  a {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.row {
  flex-direction: row;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
}
</style>
