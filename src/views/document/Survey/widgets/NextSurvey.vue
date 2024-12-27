<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSurvey } from "../store/useSurvey";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowBigRightIcon, FileIcon } from "vue-tabler-icons";
import { useQuestionnaireValidation } from "./Questionnaire/useQuestionnaireValidation";
import { SurveyService } from "../service/Survey.service";

interface IProps {
  returnId: any;
  selectedTab: number;
}

defineProps<IProps>();

const store = useSurvey();
const { data, members, loading } = storeToRefs(store);

const route = useRoute();
const router = useRouter();
const { checkAllQuestionsAnswered } = useQuestionnaireValidation();

const emits = defineEmits(["update:selectedTab"]);

const surveyId = computed(() => route.query.surveyId);
const memberLoading = ref(false);

const nextMemberIndex = computed(() => {
  let index: number | null = 0;
  if (data.value && members.value?.length) {
    const item = members.value.find((el) => surveyId.value && el.surveyId == +surveyId.value);
    if (item) {
      index = members.value.indexOf(item) + 1;
    }

    if (index == members.value.length) {
      index = 0;
    }
  }

  return index;
});

const detectChildSurveyCreated = () => {
  if (route.query.surveyDocId && route.query.createdChild) {
    return { surveyDocId: route.query.surveyDocId, createdChild: "true" };
  }

  return undefined;
};

const refresh = (id: number) => {
  store.$reset();
  loading.value = true;
  setTimeout(() => {
    store.refresh({
      returnId: id,
      query: route.query
    });
  }, 400);
};

const isButton = computed(() => {
  return {
    next: ((members.value && members.value.map((el) => !el.isCheckNext))?.filter((e) => e) || []).length >= 1,
    main: ((members.value && members.value.map((el) => el.isCheckNext)?.filter((e) => e)) || []).length == members.value?.length
  };
});

const nextSurvey = () => {
  if (data.value) {
    checkAllQuestionsAnswered({
      data: data.value,
      questionnaireTypeId: [2, 3, 4]
    })
      .then((res) => {
        if (res) {
          if (data.value && !data.value.isCheckNext) {
            SurveyService.UpdateIsCheckNext({ id: data.value.id });
          }
          router.push({ query: { surveyId: members.value[nextMemberIndex.value]?.surveyId, ...detectChildSurveyCreated() } });
          // @ts-ignore
          refresh(members.value[nextMemberIndex.value]?.surveyId);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

const mainSurvey = () => {
  if (data.value) {
    checkAllQuestionsAnswered({
      data: data.value,
      questionnaireTypeId: [2, 3, 4]
    })
      .then((res) => {
        if (res) {
          if (route.query.surveyDocId && route.query.createdChild) {
            localStorage.setItem("showFamilies", "true");
            router.replace({ params: { id: +String(route.query.surveyDocId) } });
            router.afterEach(() => {
              window.location.reload();
            });
          } else {
            localStorage.setItem("showFamilies", "true");
            router.replace({ query: undefined });
            router.afterEach(() => {
              window.location.reload();
            });
          }

          emits("update:selectedTab", 0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

defineExpose({
  nextSurvey
});
</script>

<template>
  <v-btn
    v-if="isButton.next && data?.id"
    :text="$t('next')"
    class="mr-1"
    color="info"
    :append-icon="ArrowBigRightIcon"
    :loading="memberLoading"
    @click="nextSurvey"
  />
  <v-btn
    v-if="isButton.main && data?.id && data.invQuestionnaireTypeId !== 1"
    class="mr-1"
    :text="$t('complete')"
    color="secondary"
    :append-icon="FileIcon"
    @click="mainSurvey"
  />
</template>

<style lang="scss" scoped></style>
