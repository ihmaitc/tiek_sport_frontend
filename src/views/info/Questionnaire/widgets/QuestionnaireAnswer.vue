<script setup lang="ts">
import { ILanguageList } from "@/models/basic";
import { GetQuestionnaireAnswers, GetQuestionnaireQuestions } from "../types";
import QuestionInput from "./QuestionInput.vue";
import { useQuestionnaire } from "../store/useQuestionnaire";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { SettingsIcon } from "vue-tabler-icons";

interface IProps {
  groupIndex: number;
  questionIndex: number;
  answerIndex: number;
  answer: GetQuestionnaireAnswers;
  question: GetQuestionnaireQuestions;
  languageList: ILanguageList[];
  isView?: boolean;
}

defineProps<IProps>();
const emits = defineEmits(["deleteAnswer"]);

const store = useQuestionnaire();

const { indexes, selectedAnswer } = storeToRefs(store);

const canHasText = computed(() => {
  return (question: GetQuestionnaireQuestions) => {
    if (question.answerTypeId === 3) {
      return true;
    }
    return false;
  };
});
</script>

<template>
  <v-row class="align-center my-2">
    <v-col class="py-0" cols="12">
      <QuestionInput
        :language-list="languageList"
        class="w-100"
        :view="isView"
        required
        :order-code="[
          {
            parent: groupIndex + 1,
            child: [
              {
                parent: questionIndex + 1,
                child: [
                  {
                    parent: answerIndex + 1
                  }
                ]
              }
            ]
          }
        ]"
        :placeholder="$t('answerText')"
        :label="$t('answerText')"
        column-name="answer_text"
        v-model:value="answer.answerText"
        v-model:translates="answer.translates"
        hide-plus
        :is-number="question.isNumber"
        @delete-tab-row="store.deleteAnswer(groupIndex, questionIndex, answerIndex)"
      >
        <template #delete>
          <v-sheet
            class="cursor-pointer"
            @click="
              () => {
                selectedAnswer = answer;
                indexes.groupIndex = groupIndex;
                indexes.questionIndex = questionIndex;
                indexes.answerIndex = answerIndex;
                store.checkToHasAlgorithm();
                emits('deleteAnswer', true);
              }
            "
          >
            <v-tooltip activator="parent" location="top">
              {{ $t("Delete") }}
            </v-tooltip>
            <v-icon>mdi-delete</v-icon>
          </v-sheet>
        </template>
        <template #action>
          <v-dialog width="300">
            <template #activator="{ props }">
              <SettingsIcon size="20" v-bind="props" />
            </template>

            <v-card>
              <v-card-title>
                <v-row>
                  <v-col cols="12">
                    <h3>{{ $t("answerSettings") }}</h3>
                  </v-col>
                </v-row>
              </v-card-title>

              <v-card-text> </v-card-text>
            </v-card>
          </v-dialog>
        </template>
      </QuestionInput>
    </v-col>
    <v-col class="py-0" lg="2" cols="12">
      <form-input v-if="!isView" type="number" v-model="answer.ball" :canAddZero="true" :label="$t('ball')" />
      <v-label v-else> {{ $t("ball") }} - {{ answer.ball }} </v-label>
    </v-col>
    <v-col class="py-0" lg="3" cols="12" v-if="!canHasText(question)">
      <form-checkbox v-if="!isView" v-model="answer.hasText" :label="$t('hasText')" />
      <v-label v-else> {{ $t("hasText") }} - {{ answer.hasText ? $t("yes") : $t("no") }} </v-label>
    </v-col>
  </v-row>
</template>
