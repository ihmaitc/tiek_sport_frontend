<script setup lang="ts">
import { IFields } from "@/models/basic";
import { computed, nextTick, ref, toRefs } from "vue";
import {
  GetQuestionnaireAnswers,
  GetQuestionnaireGroups,
  GetQuestionnaireQuestions,
  IUseQuestionnaireAlgorithm,
  IUseQuestionnaireAlgorithmTables
} from "../types";
import FormTabRow from "@/components/form/FormTabRow.vue";
import { SubmitEventPromise } from "vuetify";
import {
  QUESTIONNAIRE_ANSWER,
  QUESTIONNAIRE_ANSWERS,
  QUESTIONNAIRE_ANSWER_ID_2_STR,
  QUESTIONNAIRE_GROUP,
  QUESTIONNAIRE_GROUP_ID_2_STR,
  QUESTIONNAIRE_QUESTION,
  QUESTIONNAIRE_QUESTIONS,
  QUESTIONNAIRE_QUESTION_ID_2_STR
} from "../QuestionnaireConstants";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";

interface IProps {
  group: GetQuestionnaireGroups;
  groups: GetQuestionnaireGroups[];
  question: GetQuestionnaireQuestions;
  algorithm: IUseQuestionnaireAlgorithm;
  algorithms: IUseQuestionnaireAlgorithm[];
  view?: boolean;
  algorithmIndex: number;
}

const props = defineProps<IProps>();
const { group, groups, question, view, algorithmIndex, algorithms, algorithm } = toRefs(props);

const { t } = useI18n();

const editIndex = ref<number>(-1);

const emits = defineEmits(["addRow", "deleteRow", "editRow", "update:algorithm", "deleteGroup"]);

const fields: IFields[] = [
  { key: QUESTIONNAIRE_GROUP, label: "questionGroupTitle" },
  { key: QUESTIONNAIRE_QUESTION, label: "questionnaireQuestion" },
  { key: QUESTIONNAIRE_ANSWER, label: "questionnaireAnswer" },
  { key: "isEqual", label: "isEqual" },
  { key: "action", label: "actions" }
];

const answers = ref<any[]>([]);
const questions = ref<any[]>([]);

const ENUM_TABLE: IUseQuestionnaireAlgorithmTables = {
  id: 0,
  isEqual: false,
  [QUESTIONNAIRE_ANSWER_ID_2_STR]: "",
  [QUESTIONNAIRE_QUESTION_ID_2_STR]: "",
  [QUESTIONNAIRE_GROUP_ID_2_STR]: "",
  [QUESTIONNAIRE_ANSWER]: "",
  [QUESTIONNAIRE_QUESTION]: "",
  [QUESTIONNAIRE_GROUP]: ""
};

const table = ref<IUseQuestionnaireAlgorithmTables>({ ...ENUM_TABLE });

// const algorithm = ref<IUseQuestionnaireAlgorithm>({ ...ENUM_ALGORITHM });

const filterQuestions = (inMapQuestion: GetQuestionnaireQuestions, inMapQIndex: number, groupIndex: number, selectedQuestionIndex: number) => {
  return (
    inMapQuestion.id2Str !== question.value.id2Str && inMapQuestion.answerTypeId !== 3 && (groupIndex > 0 || selectedQuestionIndex > inMapQIndex)
  );
};

const shouldIncludeGroup = (group: GetQuestionnaireGroups, inMapGIndex: number, selectedGroupIndex: number, selectedQuestionIndex: number) => {
  const flag = group[QUESTIONNAIRE_QUESTIONS].some(
    (q, qIndex) => selectedQuestionIndex >= qIndex && q.id2Str !== question.value.id2Str && q.answerTypeId !== 3
  );
  return flag || (!flag && selectedGroupIndex > inMapGIndex);
};

const filteredGroups = computed(() => {
  let questionnaireGroups: GetQuestionnaireGroups[] = [];
  const selectedGroupIndex = groups.value.indexOf(group.value);
  const questionIndex = group.value[QUESTIONNAIRE_QUESTIONS].indexOf(question.value);
  if (selectedGroupIndex > 0) {
    questionnaireGroups = groups.value.filter((g, gIndex) => shouldIncludeGroup(g, gIndex, selectedGroupIndex, questionIndex));
  } else {
    questionnaireGroups = [groups.value[0]];
  }
  return {
    groups: questionnaireGroups
  };
});

const setGroup = (selectedGroupId: string) => {
  const obj = groups.value.find((el) => el.id2Str === selectedGroupId);
  if (obj) {
    table.value[QUESTIONNAIRE_GROUP] = obj.title;
    table.value[QUESTIONNAIRE_QUESTION] = "";
    table.value[QUESTIONNAIRE_QUESTION_ID_2_STR] = "";
    table.value[QUESTIONNAIRE_QUESTION] = "";
    table.value[QUESTIONNAIRE_ANSWER_ID_2_STR] = "";
    table.value[QUESTIONNAIRE_ANSWER] = "";

    setQuestions(obj);
  }
};

const setQuestions = (selectedGroup: GetQuestionnaireGroups) => {
  const questionIndex = group.value[QUESTIONNAIRE_QUESTIONS].indexOf(question.value);
  const groupIndex = groups.value.indexOf(group.value);

  if (selectedGroup) {
    questions.value = selectedGroup[QUESTIONNAIRE_QUESTIONS].filter((q, qIndex) => filterQuestions(q, qIndex, groupIndex, questionIndex));
  }
};

const setQuestion = (question: string) => {
  const obj = questions.value.find((el) => el.id2Str === question);
  if (obj) {
    table.value[QUESTIONNAIRE_QUESTION] = obj.questionText;
    table.value[QUESTIONNAIRE_ANSWER_ID_2_STR] = "";
    table.value[QUESTIONNAIRE_ANSWER] = "";
    setAnswers(obj[QUESTIONNAIRE_ANSWERS]);
  }
};

const setAnswers = (questionnaireAnswers: GetQuestionnaireAnswers[]) => {
  answers.value = questionnaireAnswers;
};

const setAnswer = (answer: string) => {
  const obj = answers.value.find((el) => el.id2Str === answer);
  if (obj) {
    table.value[QUESTIONNAIRE_ANSWER_ID_2_STR] = obj.id2Str;
    table.value[QUESTIONNAIRE_ANSWER] = obj.answerText;
  }
};

const addRow = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    if (algorithm.value.tables.some((el) => el[QUESTIONNAIRE_ANSWER_ID_2_STR] == table.value[QUESTIONNAIRE_ANSWER_ID_2_STR])) {
      notify({
        text: t("answerTextIsAccepted"),
        type: "warn"
      });
      return;
    }

    if (editIndex.value > -1) {
      Object.assign(algorithm.value.tables[editIndex.value], JSON.parse(JSON.stringify(table.value)));
    } else {
      if (
        questions.value.some(
          (question) =>
            question.id2Str === algorithm.value[QUESTIONNAIRE_QUESTION_ID_2_STR] &&
            question.answerTypeId === 1 &&
            algorithms.value[algorithmIndex.value].tables.some((al) => al[QUESTIONNAIRE_QUESTION_ID_2_STR] === question.id2Str) &&
            !algorithms.value[algorithmIndex.value].isAny
        )
      ) {
        notify({
          text: t("selectedQuestionIsSingle"),
          type: "warn"
        });
        return;
      }
      algorithm.value.tables.push(JSON.parse(JSON.stringify(table.value)));
    }
    editIndex.value = -1;
    flushAlgorithmTables();
  }
};

const editRow = async (item: IUseQuestionnaireAlgorithmTables) => {
  emits("editRow", item);
  editIndex.value = algorithm.value.tables.indexOf(item);
  table.value = JSON.parse(JSON.stringify(item));

  // /* FIND SELECTED GROUP QUESTIONS */
  const group = groups.value.find((el) => el.id2Str === item[QUESTIONNAIRE_GROUP_ID_2_STR]);
  group && setQuestions(group);

  await nextTick();
  // /* JUST WAIT ENDING OPERATION AND FIND ACTIVE GROUP ANSWERS */
  const answers = questions.value.find((el) => el.id2Str === item[QUESTIONNAIRE_QUESTION_ID_2_STR]);
  setAnswers(answers[QUESTIONNAIRE_ANSWERS]);
};

const deleteRow = (index: number) => {
  algorithm.value.tables.splice(index, 1);
};

// const deleteGroup = () => {
//   emits("deleteGroup", algorithmIndex.value);
// };

const flushAlgorithmTables = () => {
  Object.assign(table.value, ENUM_TABLE);
};
</script>

<template>
  <ui-parent-card class="mt-4">
    <v-row>
      <v-col>
        <form-checkbox v-model="algorithm.isAny" :label="$t('isAny')" :disabled="view" />
      </v-col>
      <!-- <v-col class="text-right">
        <v-btn :icon="TrashIcon" color="error" variant="tonal" size="small" @click="deleteGroup"> </v-btn>
      </v-col> -->
    </v-row>
    <FormTabRow
      :fields="fields"
      :items="algorithm.tables"
      :actions="{
        isDelete: view ? false : true,
        isEdit: view ? false : true
      }"
      @edit-tab-row="editRow"
      @delete-tab-row="deleteRow"
      v-model:edit-index="editIndex"
      @clear-tab-row="flushAlgorithmTables"
    >
      <v-form @submit.prevent="addRow" v-if="!view">
        <v-row class="align-center mb-3">
          <v-col cols="12" lg="3" md="6">
            <form-select
              v-model="table[QUESTIONNAIRE_GROUP_ID_2_STR]"
              :list="filteredGroups.groups"
              itemTitle="title"
              itemValue="id2Str"
              @update:model-value="setGroup"
              required
              :label="$t('questionGroupTitle')"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6">
            <form-select
              v-model="table[QUESTIONNAIRE_QUESTION_ID_2_STR]"
              :list="questions"
              itemTitle="questionText"
              itemValue="id2Str"
              @update:model-value="setQuestion"
              required
              :label="$t('questionnaireQuestion')"
            />
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <form-select
              v-model="table[QUESTIONNAIRE_ANSWER_ID_2_STR]"
              :list="answers"
              itemTitle="answerText"
              itemValue="id2Str"
              @update:model-value="setAnswer"
              required
              :label="$t('questionnaireAnswer')"
            />
          </v-col>
          <v-col cols="12" lg="1" md="6" class="py-0">
            <form-checkbox v-model="table.isEqual" :label="$t('isEqual')"> </form-checkbox>
          </v-col>
          <v-col cols="12" lg="3" md="6" class="py-0">
            <v-btn type="submit" :color="editIndex > -1 ? 'success' : 'info'">
              {{ editIndex > -1 ? $t("Save") : $t("AddRow") }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <template #isEqual="{ item }">
        <td>
          {{ item.isEqual ? $t("yes") : $t("no") }}
        </td>
      </template>
    </FormTabRow>
  </ui-parent-card>
</template>
