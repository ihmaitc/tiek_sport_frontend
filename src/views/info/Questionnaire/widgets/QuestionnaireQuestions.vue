<script setup lang="ts">
import { computed, ref } from "vue";
import { GetQuestionnaireGroups, GetQuestionnaireQuestions } from "../types";
import { QUESTIONNAIRE_ALGORITHMS, QUESTIONNAIRE_ANSWERS, QUESTIONNAIRE_GROUPS, QUESTIONNAIRE_QUESTION_ID_2_STR } from "../QuestionnaireConstants";
import { useQuestionnaire } from "../store/useQuestionnaire";
import QuestionInput from "./QuestionInput.vue";
import { ILanguageList } from "@/models/basic";
import { AlignBoxBottomCenterIcon, FlameIcon, PlusIcon, SettingsIcon, XIcon } from "vue-tabler-icons";
import { VBtn } from "vuetify/components";
import Algorithms from "./Algorithms.vue";
import Constraints from "./Constraints.vue";
import { storeToRefs } from "pinia";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import QuestionnaireAnswer from "./QuestionnaireAnswer.vue";
import { QuestionnaireService } from "@/services/info/Questionnaire.service";
import { useErrorToast } from "@/utils/helpers/useErrorToast";

interface IProps {
  group: GetQuestionnaireGroups;
  question: GetQuestionnaireQuestions;
  questionIndex: number;
  groupIndex: number;
  languageList: ILanguageList[];
  isView?: boolean;
}

const props = defineProps<IProps>();
const store = useQuestionnaire();
const { indexes, selectedQuestion, selectedAnswer, selectedQuestionGroup, data } = storeToRefs(store);
const { setError } = useErrorToast();
const { t } = useI18n();

const isSettings = ref<boolean>(false);
const constraintsModal = ref<boolean>(false);
const isAlgorithm = ref<boolean>(false);
const deleteModal = ref<boolean>(false);
const isDynamicScoringCriteria = ref<boolean>(false);

const changeQuesionDynamicCriteria = (val: number) => {
  store.setDynamicScoringCriteriaValueSelectList(val);
  for (const answer of props.question.invQuestionnaireAnswers) {
    answer.criteriaValueId = null;
  }
};

const updateCriteria = () => {
  QuestionnaireService.UpdateCriteria(props.question)
    .then(() => {
      isDynamicScoringCriteria.value = false;
    })
    .catch((err) => {
      setError(err);
    });
};

const canShowAlgorithmIcon = computed(() => {
  return (id2Str: string) => {
    return store.getData?.[QUESTIONNAIRE_ALGORITHMS].some((el) => el[QUESTIONNAIRE_QUESTION_ID_2_STR] == id2Str);
  };
});

const isAddAnswer = computed(() => {
  return (type: number | null) => {
    if (type === 3) {
      return false;
    }
    return true;
  };
});

const addAnswer = async (groupIndex: number, questionIndex: number, answerType: number | null) => {
  if (!answerType) {
    notify({
      text: t("selectAnswerType"),
      type: "warn"
    });
    return;
  }
  store.addAnswer(groupIndex, questionIndex);
};

const openCriteriaDialog = () => {
  isDynamicScoringCriteria.value = true;
  if (props.question && props.question.criteriaId) {
    store.setDynamicScoringCriteriaValueSelectList(props.question.criteriaId);
  }
};
</script>

<template>
  <v-list-group class="px-3">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :title="question.questionText">
        <template #prepend>
          {{ questionIndex + 1 }}.
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
                  selectedQuestion = question;
                  store.checkToHasAlgorithm();

                  indexes.groupIndex = groupIndex;
                  indexes.questionIndex = questionIndex;
                  indexes.answerIndex = null;

                  deleteModal = true;
                }
              "
              >mdi-delete</v-icon
            >
            <v-tooltip activator="parent" location="top">
              {{ $t("Delete") }}
            </v-tooltip>
          </div>
          <SettingsIcon
            class="cursor-pointer"
            @click="
              () => {
                isSettings = true;
                selectedQuestionGroup = group;
                selectedQuestion = question;
                indexes.questionIndex = questionIndex;
                indexes.groupIndex = groupIndex;
              }
            "
          />
          <div class="d-flex align-center" v-if="isView">
            <AlignBoxBottomCenterIcon class="cursor-pointer" color="rgb(var(--v-theme-info))" @click="openCriteriaDialog" />
            <v-tooltip activator="parent" location="top">
              {{ $t("questindynamiccriteria") }}
            </v-tooltip>
          </div>
        </template>
      </v-list-item>
    </template>

    <v-sheet rounded color="rgba(var(--v-theme-grey100),0.5)" class="pa-2">
      <v-row class="align-center mt-2">
        <v-col lg="10" cols="12" class="py-1">
          <QuestionInput
            :language-list="languageList"
            required
            :placeholder="$t('questionText')"
            :label="`${$t('questionText')}`"
            :view="isView"
            column-name="question_text"
            v-model:value="question.questionText"
            v-model:translates="question.translates"
            hide-x
          />
        </v-col>

        <v-col lg="2" cols="12" class="py-1">
          <form-checkbox v-if="!isView" v-model="question.isRequired" :label="$t('questionRequired')"> </form-checkbox>
          <v-label v-else> {{ $t("questionRequired") }} - {{ question.isRequired ? $t("yes") : $t("no") }} </v-label>
        </v-col>
      </v-row>
      <v-row class="align-center">
        <v-col class="py-1" lg="10">
          <form-input v-if="!isView" :label="$t('hint')" v-model="question.hint"></form-input>
          <v-label v-if="question.hint && isView" class="font-weight-semibold"> {{ $t("hint") }}: </v-label> <br />
          <v-label v-if="question.hint && isView"> {{ question.hint }} </v-label>
        </v-col>
        <v-col class="py-1" lg="2">
          <form-checkbox v-if="!isView && question.answerTypeId == 3" v-model="question.isNumber" :label="$t('isNumber')"> </form-checkbox>
        </v-col>
      </v-row>
      <v-row class="align-center" v-if="question.answerTypeId == 3 && question.isNumber">
        <v-col class="py-1" lg="3" md="3">
          <form-input v-if="!isView" mask="######################" :label="$t('minValue')" v-model="question.minValue"></form-input>
          <v-label v-if="question.hint && isView" class="font-weight-semibold"> {{ $t("minValue") }}: </v-label> <br />
          <v-label v-if="question.hint && isView"> {{ question.minValue }} </v-label>
        </v-col>
        <v-col class="py-1" lg="3" md="3">
          <form-input v-if="!isView" mask="######################" :label="$t('maxValue')" v-model="question.maxValue"></form-input>
          <v-label v-if="question.hint && isView" class="font-weight-semibold"> {{ $t("maxValue") }}: </v-label> <br />
          <v-label v-if="question.hint && isView"> {{ question.maxValue }} </v-label>
        </v-col>
      </v-row>

      <v-row class="align-center mb-4" v-if="!isView">
        <v-col
          cols="12"
          lg="3"
          md="4"
          v-for="(answerType, answerTypeIndex) in store.GetAnswerTypeSelectList"
          class="py-2"
          :class="[
            {
              'text-success': answerType.value === question.answerTypeId,
              'd-none': answerTypeIndex === 2 && answerType.value === 3 && question.questionAnswerTemplateId
            },
            `cursor-${answerTypeIndex === 2 && answerType.value === 3 && question.questionAnswerTemplateId ? 'default' : 'pointer'}`
          ]"
          @click="
            () => {
              if (answerType.value === 3 && question.questionAnswerTemplateId) {
                return;
              }
              store.selectAnswerType(groupIndex, questionIndex, answerType);
            }
          "
        >
          <v-icon size="24" v-if="answerType.value == 1">mdi-checkbox-blank-circle-outline</v-icon>
          <v-icon size="24" v-if="answerType.value == 2">mdi-checkbox-blank-outline</v-icon>
          <v-icon size="24" v-if="answerType.value == 3">mdi-format-color-text</v-icon>
          {{ answerType.text }}
        </v-col>
        <v-col cols="12" lg="3" md="4" class="py-1">
          <form-select
            v-if="question.answerTypeId !== 3"
            :list="store.getQuestionAnswerTemplate"
            v-model="question.questionAnswerTemplateId"
            :label="$t('QuestionAnswerTemplate')"
            noSearch
            clearable
            @clear="store.clearAlgorithmsOnChangeAnswerTemplate(question)"
            @update:model-value="
                    (val:number) =>
                    store.acceptAnswersFromTemplate(
                        groupIndex,
                        questionIndex,
                        val
                      )
                  "
          >
          </form-select>
        </v-col>
      </v-row>
    </v-sheet>

    <v-card elevation="0" class="border mt-3" v-if="question[QUESTIONNAIRE_ANSWERS]?.length">
      <v-card-title>
        <h2>{{ $t("answers") }}: {{ question[QUESTIONNAIRE_ANSWERS]?.length }}</h2>
      </v-card-title>
      <v-card-text>
        <template v-for="(answer, answerIndex) in question[QUESTIONNAIRE_ANSWERS]">
          <QuestionnaireAnswer
            :groupIndex="groupIndex"
            :questionIndex="questionIndex"
            :answerIndex="answerIndex"
            :answer="answer"
            :question="question"
            :languageList="languageList"
            :isView="isView"
            @deleteAnswer="deleteModal = true"
          />
          <v-divider class="my-2"></v-divider>
        </template>
      </v-card-text>
    </v-card>

    <v-btn
      v-if="isAddAnswer(question.answerTypeId) && !question.questionAnswerTemplateId && !isView"
      color="success"
      class="mt-3"
      @click="addAnswer(groupIndex, questionIndex, question.answerTypeId)"
    >
      {{ $t("AddAnswer") }}
    </v-btn>

    <!-- MODALS -->
    <v-dialog width="400" scrollable v-model="isSettings">
      <v-card>
        <v-card-title>
          <v-row class="align-center">
            <v-col cols="auto"> {{ $t("settings") }}</v-col>
            <v-spacer />
            <v-col cols="auto">
              <v-btn :icon="XIcon" @click="isSettings = false" variant="tonal" size="small" color="info"> </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" v-if="question.answerTypeId == 3">
              <form-input v-model:model-value="question.minLenght" :label="$t('minLength')" mask="################################"> </form-input>
            </v-col>
            <v-col cols="12" v-if="question.answerTypeId == 3">
              <form-input v-model:model-value="question.maxLenght" :label="$t('maxLength')" mask="################################"> </form-input>
            </v-col>
            <v-col cols="12" v-if="canShowAlgorithmIcon">
              <VBtn block @click="isAlgorithm = true" color="primary" variant="outlined" :text="$t('Condition')" :prepend-icon="FlameIcon"> </VBtn>
            </v-col>
            <v-col cols="12" v-if="indexes.questionIndex !== null">
              <VBtn
                v-if="!isView"
                block
                color="info"
                variant="outlined"
                @click="
                  () => {
                    if (indexes.questionIndex !== null) {
                      store.addQuestionBeforeAfter(groupIndex, indexes.questionIndex);
                      isSettings = false;
                    }
                  }
                "
                :prepend-icon="PlusIcon"
                :text="$t('addQuestionBefore')"
              >
              </VBtn>
            </v-col>
            <v-col cols="12" v-if="indexes.questionIndex !== null">
              <VBtn
                v-if="!isView"
                block
                color="info"
                variant="outlined"
                @click="
                  () => {
                    if (indexes.questionIndex !== null) {
                      store.addQuestionBeforeAfter(groupIndex, indexes.questionIndex + 1);
                      isSettings = false;
                    }
                  }
                "
                :prepend-icon="PlusIcon"
                :text="$t('addQuestionAfter')"
              >
              </VBtn>
            </v-col>
            <v-col cols="12" v-if="selectedQuestion">
              <VBtn
                v-if="
                  selectedQuestion[QUESTIONNAIRE_ANSWERS] && selectedQuestion[QUESTIONNAIRE_ANSWERS].length > 0 && selectedQuestion.answerTypeId === 2
                "
                block
                color="info"
                variant="outlined"
                @click="
                  () => {
                    constraintsModal = true;
                    indexes.groupIndex = groupIndex;
                  }
                "
              >
                {{ $t("constraints") }}
              </VBtn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn color="error" @click="isSettings = false"> {{ $t("close") }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAlgorithm" height="100%">
      <Algorithms
        class="h-100"
        v-if="data && selectedQuestionGroup && selectedQuestion"
        :question="selectedQuestion"
        :data-algorithms="data[QUESTIONNAIRE_ALGORITHMS]"
        :groups="data[QUESTIONNAIRE_GROUPS]"
        :group="selectedQuestionGroup"
        v-model:model-value="isAlgorithm"
        @save="store.saveCondition"
        :view="isView"
      />
    </v-dialog>

    <v-dialog v-model="deleteModal" width="450">
      <v-card>
        <v-card-text class="text-center">
          <div v-html="$t('attention')"></div>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                color="error"
                variant="flat"
                block
                @click="
                  () => {
                    deleteModal = false;
                    selectedAnswer = null;
                    selectedQuestion = null;
                  }
                "
              >
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                color="success"
                variant="flat"
                block
                @click="
                  () => {
                    deleteModal = false;
                    store.deleteQuestionAnswerAlgorithm();
                  }
                "
              >
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="constraintsModal" height="100%">
      <Constraints
        class="h-100"
        v-if="selectedQuestion"
        :isView="isView"
        v-model="constraintsModal"
        :answers="selectedQuestion?.[QUESTIONNAIRE_ANSWERS]"
        :constrains="selectedQuestion.constraints"
        @saveConstraints="
          (val) => {
            store.saveConstraints(val);
            constraintsModal = false;
          }
        "
      />
    </v-dialog>

    <v-dialog v-model="isDynamicScoringCriteria" width="800">
      <v-card>
        <v-card-title class="text-center h3">
          <div v-html="$t('questindynamiccriteria')"></div>
        </v-card-title>
        <v-card-text class="py-0">
          <v-row class="ma-0">
            <v-col cols="12">
              <span>{{ question.questionText }} </span>
            </v-col>
            <v-col cols="12" lg="6">
              <form-select
                :list="store.dynamicScoringCriteriaSelectList"
                v-model="question.criteriaId"
                :label="$t('questionDynamicCriteria')"
                @update:model-value="changeQuesionDynamicCriteria"
              >
              </form-select>
            </v-col>
          </v-row>
          <template v-for="answer in question.invQuestionnaireAnswers">
            <v-col cols="12">
              <span>{{ $t("answerText") }}: {{ answer.answerText }} </span>
              <form-select :list="store.dynamicScoringCriteriaValueSelectList" v-model="answer.criteriaValueId" class="mt-2"> </form-select>
            </v-col>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn color="error" variant="flat" block @click="isDynamicScoringCriteria = false">
                {{ $t("Cancel") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn color="success" variant="flat" block @click="updateCriteria">
                {{ $t("attachCriteria") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-group>
</template>
