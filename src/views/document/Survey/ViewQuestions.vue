<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSurvey } from "./store/useSurvey";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { SubmitEventPromise } from "vuetify";
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue";
import i18n from "@/app/config/i18n";
import { notify } from "@kyvg/vue3-notification";
import { VForm } from "vuetify/components";
import { ALGORITHMS_KEY, GROUPS_KEY } from "./SurveyConstants";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import FormCanButtons from "@/components/FormCanButtons.vue";
import { SurveyService } from "./service/Survey.service";
import LogList from "@/components/LogList.vue";
import { AlertTriangleIcon, ArrowLeftIcon, ArrowRightIcon, GitCompareIcon } from "vue-tabler-icons";
import SxkSkorintResult from "./widgets/SxkSkorintResult.vue";
import ApproveDecisionReasons from "./widgets/ApproveDecisionReasons.vue";
import { useQuestionnaireValidation } from "./widgets/Questionnaire/useQuestionnaireValidation";
import InvSurveyApprove from "./widgets/InvSurveyApprove.vue";
import { useAppUrl } from "@/composables/useAppUrl";
import { IDataFiles } from "./types";
import FancyBox from "@/components/FancyBox.vue";
import ScoringResult from "./widgets/ScoringResult.vue";
import SurveyComparision from "./widgets/SurveyComparision.vue";

const { t } = useI18n();

const store = useSurvey();
const { data, loading } = storeToRefs(store);
const route = useRoute();
const { setError } = useErrorToast();
const { checkAllQuestionsAnswered } = useQuestionnaireValidation();
const { API_URL } = useAppUrl();

const isComplete = ref(false);
const isCompleteLoading = ref(false);
const compareGetResult = ref(false);
const selectedTab = ref<number>(0);

const tabs = ref([
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

const checkStarted = () => {
  tabs.value.forEach((el) => {
    if (el.title == "questions") {
      el.isVisible = !!data.value?.startAt;
    }
  });
};

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors && errors.length > 0) {
    document
      // @ts-ignore
      .getElementById(errors[0].id)
      ?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "center"
      });
  }

  if (valid) {
    if (data.value) {
      checkAllQuestionsAnswered({
        data: data.value,
        questionnaireTypeId: [1, 2, 3, 4]
      })
        .then((res) => {
          if (res) {
            store.saveData({
              cb(e) {
                notify({
                  text: i18n.global.t("SaveSuccess"),
                  type: "success"
                });
              },
              err(e) {
                setError(e);
              }
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
};

const get = () => {
  store.setData({
    id: String(route.params.id),
    err(e) {
      setError(e);
    },
    cb() {
      checkStarted();
    }
  });
};

const completeSurvey = () => {
  if (data.value) {
    checkAllQuestionsAnswered({
      data: data.value,
      questionnaireTypeId: [1, 2, 3, 4]
    })
      .then((res) => {
        if (res) {
          isCompleteLoading.value = true;

          store.completeSurvey(
            () => {
              isComplete.value = false;
              notify({
                text: t("completedSuccess"),
                type: "success"
              });
            },
            (e) => {
              setError(e);
            },
            () => {
              isComplete.value = false;
            }
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const getFile = (file: IDataFiles) => {
  return `${API_URL.value}InvSurvey/DownloadFile/${file.id}`;
};

window.addEventListener("popstate", () => {
  if (selectedTab.value == 1) return;

  store.$reset();
  loading.value = true;
  selectedTab.value = 1;

  setTimeout(() => {
    if (dataId.value) {
      store.refresh({
        returnId: dataId.value,
        query: route.query
      });
    }
  }, 400);
});

onMounted(() => {
  get();
});

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>

    <v-form @submit.prevent="saveData" ref="form">
      <div v-if="data && !loading">
        <!-- <v-tabs v-model="selectedTab" bg-color="textPrimary" align-tabs="center">
          <v-tab v-for="(tab, index) in tabs" :value="tab.title" :key="index" :append-icon="tab.icon">
            {{ $t(tab.title) }}
          </v-tab>
        </v-tabs> -->

        <v-window v-model:modelValue="selectedTab">
          <v-window-item v-for="(tab, _) in tabs" :value="tab.title">
            <component
              v-if="tab.isVisible"
              :is="tab.component"
              :data="data[GROUPS_KEY]"
              :algorithms="data[ALGORITHMS_KEY]"
              :end-at="data.endAt"
              is-view
            />
            <ui-parent-card v-if="data.files?.length && selectedTab == 1" class="mt-4">
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
            <UiParentCard v-if="!tab.isVisible && tab.title == 'questions'" class="text-center">
              <v-alert color="warning" variant="tonal">
                <div class="d-flex align-center justify-center ga-2">
                  <AlertTriangleIcon size="20" />
                  <span class="font-weight-bold text-13"> {{ $t("mustStartSurvey") }} </span>
                </div>
              </v-alert>
            </UiParentCard>
          </v-window-item>
        </v-window>

        <SxkSkorintResult class="mt-4" />
        <InvSurveyApprove class="mt-4" />
        <ApproveDecisionReasons class="mt-4" />
        <ApproveDecisionReasons class="mt-4" />
        <ScoringResult class="mt-4" />

        <v-expansion-panels v-if="store?.getData?.canCompareGetResult" class="mt-4" v-model="compareGetResult">
          <v-expansion-panel class="px-0">
            <v-expansion-panel-title>
              <h4>{{ $t("SurveyCompare") }}</h4>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <SurveyComparision
                class="mx-n2"
                :item="{ surveyId: data.id, applicationPersonId: data?.applicantPerson?.id }"
                isSurvey
                @close="compareGetResult = false"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <LogList v-if="data" :logs="data?.logList"></LogList>
        <FormCanButtons v-if="data" :data="data" :service="SurveyService" permission="Survey" class="pt-4">
          <template #default="{ data, openModal }">
            <v-btn
              v-if="data && store.getData?.canUpdateMfyComissionMember"
              color="success"
              class="mr-4"
              :text="$t('UpdateMfyComissionMember')"
              @click="
                openModal({
                  cb: 'UpdateMfyComissionMember',
                  id: data.id,
                  title: 'UpdateMfyComissionMember'
                })
              "
              variant="flat"
            >
            </v-btn>
            <v-btn
              v-if="data && store.getData?.canComplete"
              color="success"
              class="mr-4"
              :text="$t('completeSurvey')"
              @click="completeSurvey"
              variant="flat"
            >
            </v-btn>
            <v-btn
              v-if="data && store.getData?.canCompare"
              color="violet"
              class="mr-4"
              variant="flat"
              :text="$t('canCompare')"
              :append-icon="GitCompareIcon"
              @click="
                openModal({
                  title: 'canCompare',
                  id: data.id,
                  cb: 'CreateIncpectionSurvey'
                })
              "
            >
            </v-btn>
            <v-btn
              v-if="store.getData?.statusId == 8"
              color="info"
              class="mr-4"
              @click="
                openModal({
                  title: 'ResendSMS',
                  id: data.id,
                  cb: 'ResendSMS'
                })
              "
              :text="$t('ResendSMS')"
              variant="flat"
            >
            </v-btn>
            <v-btn class="mr-1" v-if="selectedTab == 1" @click="selectedTab = 0" :prepend-icon="ArrowLeftIcon" :text="$t('docPage')" color="info" />
            <v-btn
              @click="selectedTab = 1"
              v-if="route.params.id !== '0' && selectedTab !== 1"
              color="violet"
              :text="$t('goSurveyQuestions')"
              :append-icon="ArrowRightIcon"
            >
            </v-btn>
          </template>
        </FormCanButtons>
      </div>
    </v-form>
  </div>
</template>
<style>
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
</style>
