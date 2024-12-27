<script setup lang="ts">
import UiParentCard from "@/components/UiParentCard.vue";
import { useQuestionnaire } from "./store/useQuestionnaire";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify";
import { onBeforeUnmount, onMounted } from "vue";
import { useErrorToast } from "@/utils/helpers/useErrorToast";
import { notify } from "@kyvg/vue3-notification";
import QuestionnaireGroup from "./widgets/QuestionnaireGroup.vue";
import { QUESTIONNAIRE_ANSWERS, QUESTIONNAIRE_GROUPS, QUESTIONNAIRE_QUESTIONS, QUESTIONNAIRE_TYPE_ID } from "./QuestionnaireConstants";
import { useI18n } from "vue-i18n";

const store = useQuestionnaire();
const route = useRoute();
const router = useRouter();
const { setError } = useErrorToast();
const { t } = useI18n();

const id = route.params.id as string;
const isClone = route.query.clone as string;

store.setData({
  id,
  isClone,
  err(e) {
    setError(e);
  },
  cb() {}
});

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
    if (store.getData) {
      for (let i = 0; i < store.getData[QUESTIONNAIRE_GROUPS].length; i++) {
        let group = store.getData[QUESTIONNAIRE_GROUPS][i];
        for (let j = 0; j < group[QUESTIONNAIRE_QUESTIONS].length; j++) {
          let question = group[QUESTIONNAIRE_QUESTIONS][j];
          if (question[QUESTIONNAIRE_ANSWERS].length == 0 && question.answerTypeId !== 3) {
            notify({
              text: t("mustAddAnswer", {
                questionText: question.questionText,
                questionNumber: `${i + 1}. ${j + 1}.`
              }),
              type: "warn"
            });
            return;
          }
        }
      }

      store.getData[QUESTIONNAIRE_GROUPS].forEach((group) => {
        group[QUESTIONNAIRE_QUESTIONS].forEach((question) => {
          question[QUESTIONNAIRE_ANSWERS].forEach((answer) => {
            answer.ball = +answer.ball;
          });
        });
      });
      store.saveData({
        cb() {
          notify({
            text: t("SaveSuccess"),
            type: "success"
          });
          router.push({ name: "Questionnaire" });
        },
        err(e) {
          setError(e);
        }
      });
    }
  }
};

onMounted(() => {
  store.setQuestionTypeList();
  store.setAnswerTypeSelectList();
  store.setQuestionTemplate();
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
    <v-form @submit.prevent="saveData" v-if="store.getData && !store.getLoading">
      <UiParentCard>
        <v-row>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-picker clearable required v-model="store.getData.docOn" :label="$t('docOn')" />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-input required v-model="store.getData.docNumber" :label="$t('docNumber')" />
          </v-col>
        </v-row>
      </UiParentCard>
      <UiParentCard class="mt-4">
        <v-row>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              required
              v-model="store.getData[QUESTIONNAIRE_TYPE_ID]"
              :list="store.GetQuestionnaireTypeSelectList"
              :label="$t('questionnaireType')"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-input required v-model="store.getData.title" :label="$t('questionTitle')" />
          </v-col>
        </v-row>
      </UiParentCard>

      <QuestionnaireGroup />
      <v-row class="mt-2 px-3">
        <v-btn color="error" variant="flat" @click="router.back()" :text="$t('Back')" />
        <v-spacer />
        <v-btn
          v-if="store.getData"
          color="info"
          @click="store.addGroup"
          :loading="store.getSaveLoading"
          variant="flat"
          :text="$t('AddQuestionGroup')"
          class="mr-2"
        />
        <v-btn v-if="store.getData" color="success" :loading="store.getSaveLoading" variant="flat" type="submit" :text="$t('Save')" />
      </v-row>
    </v-form>
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
