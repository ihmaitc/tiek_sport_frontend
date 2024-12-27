<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuestionnaire } from "./store/useQuestionnaire";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import UiParentCard from "@/components/UiParentCard.vue";
import { useGlobal } from "@/composables/useGlobal";
import { onBeforeUnmount, onMounted } from "vue";
import LogList from "@/components/LogList.vue";
import QuestionnaireGroup from "./widgets/QuestionnaireGroup.vue";
import FormCanButtons from "@/components/FormCanButtons.vue";
import { QUESTIONNAIRE_PERMISSION, QUESTIONNAIRE_TYPE } from "./QuestionnaireConstants";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";

const route = useRoute();
const { getColor } = useGlobal();
const store = useQuestionnaire();
const { setError } = useErrorToast();

const id = route.params.id as string;

onMounted(() => {
  store.setData({
    id,
    err(e) {
      setError(e);
    },
    cb() {}
  });
});

onBeforeUnmount(() => {
  store.$reset();
});
</script>

<template>
  <div>
    <UiParentCard v-if="store.getLoading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <UiParentCard v-if="store.getData">
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("docNumber") }}: </v-label>
          <span>{{ store.getData.docNumber }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold"> {{ $t("docOn") }}: </v-label>
          <span>{{ store.getData.docOn }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("questionnaireType") }}: </v-label>
          <span>{{ store.getData[QUESTIONNAIRE_TYPE] }}</span>
        </v-col>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold"> {{ $t("questionTitle") }}: </v-label>
          <span>{{ store.getData.title }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="6" class="py-0 d-flex">
          <v-label class="mb-2 font-weight-bold">{{ $t("status") }}: </v-label>
          <v-chip rounded="lg" :class="`font-weight-bold px-2  mx-2 bg-${getColor(store.getData)}`" size="small">
            {{ store.getData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </UiParentCard>
    <QuestionnaireGroup is-view />

    <LogList v-if="store.getData && store.getData.logList" :logs="store.getData.logList" />
    <FormCanButtons v-if="store.getData" :service="QuestionnaireService" :permission="QUESTIONNAIRE_PERMISSION" :data="store.getData" class="pt-4" />
  </div>
</template>

<style lang="scss" scoped>
.answer {
  counter-increment: section;
}

ul {
  counter-reset: index;
  list-style-type: none;
}

.answerText {
  display: flex;
  align-items: center;
  position: relative;

  &::before {
    counter-increment: index;
    content: counters(index, ".", upper-alpha);
    margin-right: 10px;
  }
}
</style>
