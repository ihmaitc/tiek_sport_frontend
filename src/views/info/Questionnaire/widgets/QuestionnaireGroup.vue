<script setup lang="ts">
import { useQuestionnaire } from "../store/useQuestionnaire";
import { useManualStore } from "@/app/config/store/Manual";
import QuestionInput from "./QuestionInput.vue";
import { QUESTIONNAIRE_GROUPS, QUESTIONNAIRE_QUESTIONS } from "../QuestionnaireConstants";
import QuestionnaireQuestions from "./QuestionnaireQuestions.vue";

interface IProps {
  isView?: boolean;
}

defineProps<IProps>();

const store = useQuestionnaire();
const manual = useManualStore();
store.setDynamicScoringCriteriaSelectList();
</script>

<template>
  <div>
    <v-list class="px-2 py-2 mt-4" v-for="(group, groupIndex) in store.getData?.[QUESTIONNAIRE_GROUPS]">
      <v-list-group class="align-center justify-center px-2">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="`${group.title || $t('questionGroupTitle')}, ${$t('questionsCount')} - ${group[QUESTIONNAIRE_QUESTIONS].length}.`"
          >
            <template #prepend>
              {{ groupIndex + 1 }}.
              <div class="mr-3">
                <v-tooltip activator="parent" location="top">
                  {{ $t("QuestionGroup") }}
                </v-tooltip>
                <v-icon class="ml-3">mdi-comment-question-outline </v-icon>
              </div>
            </template>
            <template #append="{ isActive }">
              <div v-if="isActive">
                <v-icon>mdi-arrow-up</v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("hide") }}
                </v-tooltip>
              </div>
              <div v-else>
                <v-icon>mdi-arrow-down</v-icon>
                <v-tooltip activator="parent" location="top">
                  {{ $t("show") }}
                </v-tooltip>
              </div>
              <div v-if="!isView">
                <v-icon
                  @click.self="
                    () => {
                      store.deleteGroup(groupIndex);
                    }
                  "
                  >mdi-delete</v-icon
                >
                <v-tooltip activator="parent" location="top">
                  {{ $t("Delete") }}
                </v-tooltip>
              </div>
            </template>
          </v-list-item>
        </template>
        <v-row>
          <v-col cols="12">
            <form-input v-model="group.groupTitle" :label="$t('groupTitle')"> </form-input>
          </v-col>
          <v-col cols="12">
            <v-label class="mb-2 d-block"> {{ $t("groupDescription") }} </v-label>
            <v-textarea class="w-100" v-model="group.groupDescription"> </v-textarea>
          </v-col>
        </v-row>
        <QuestionInput
          :language-list="manual.LanguageList"
          required
          :placeholder="$t('questionGroupTitle')"
          :label="$t('questionGroupTitle')"
          column-name="title"
          :view="isView"
          v-model:value="group.title"
          v-model:translates="group.translates"
          @delete-tab-row="store.deleteGroup(groupIndex)"
        />
        <div class="" v-if="group[QUESTIONNAIRE_QUESTIONS]?.length">
          <v-card class="border" elevation="0">
            <v-card-text class="px-0">
              <v-list class="">
                <template v-for="(question, questionIndex) in group[QUESTIONNAIRE_QUESTIONS]">
                  <QuestionnaireQuestions
                    :group="group"
                    :question="question"
                    :question-index="questionIndex"
                    :group-index="groupIndex"
                    :language-list="manual.LanguageList"
                    :is-view="isView"
                  />
                  <v-divider class="my-2"></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
        <v-btn class="py-2 mt-3" @click="store.addQuestion(groupIndex)" color="success" v-if="!isView">
          {{ $t("AddQuestion") }}
        </v-btn>
      </v-list-group>
    </v-list>
  </div>
</template>
