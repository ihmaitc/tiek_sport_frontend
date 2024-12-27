<script setup lang="ts">
import { onBeforeUnmount, ref, toRefs } from "vue";
import { ArrowLeftIcon, DeviceFloppyIcon, XIcon } from "vue-tabler-icons";
import { GetQuestionnaireGroups, GetQuestionnaireQuestions, IUseQuestionnaireAlgorithm } from "../types";
import { useQuestionnaire } from "../store/useQuestionnaire";
import { QUESTIONNAIRE_QUESTION_ID_2_STR } from "../QuestionnaireConstants";
import Algorithm from "./Algorithm.vue";

interface IProps {
  dataAlgorithms: IUseQuestionnaireAlgorithm[];
  group: GetQuestionnaireGroups;
  groups: GetQuestionnaireGroups[];
  question: GetQuestionnaireQuestions;
  view?: boolean;
}

const props = defineProps<IProps>();
const { group, groups, question, view } = toRefs(props);
const store = useQuestionnaire();

const emits = defineEmits<{
  (e: "save", value: IUseQuestionnaireAlgorithm[]): void;
  (e: "update:model-value", value: any): void;
}>();

const ENUM_ALGORITHM: IUseQuestionnaireAlgorithm = {
  id: 0,
  isAny: false,
  [QUESTIONNAIRE_QUESTION_ID_2_STR]: props.question.id2Str,
  tables: []
};

const algorithms = ref<IUseQuestionnaireAlgorithm[]>([ENUM_ALGORITHM]);

if (props.dataAlgorithms && props.dataAlgorithms.length > 0) {
  for (const item of props.dataAlgorithms) {
    for (const al of algorithms.value) {
      if (item[QUESTIONNAIRE_QUESTION_ID_2_STR] === al[QUESTIONNAIRE_QUESTION_ID_2_STR]) {
        console.log(item);
        algorithms.value = props.dataAlgorithms;
      }
    }
  }
}

// const addGroup = () => {
//   algorithms.value.push(JSON.parse(JSON.stringify(ENUM_ALGORITHM)));

//   console.log(algorithms.value)
// };

// const deleteGroup = (index: number) => {
//   algorithms.value.splice(index, 1);
// };

const save = () => {
  emits("save", algorithms.value);
  emits("update:model-value", false);
};

onBeforeUnmount(() => {
  store.flushAlgorithm();
  store.flushAlgorithmTables();
});
</script>

<template>
  <v-card height="100%" class="px-5 py-5">
    <v-card-title>
      <v-row>
        <v-col>
          <h5>{{ $t("Condition") }}</h5>
        </v-col>
        <v-col class="text-right">
          <XIcon class="cursor-pointer" @click="emits('update:model-value', false)" />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="overflow-auto">
      <template v-for="(algorithm, algorithmIndex) in algorithms">
        <template v-if="algorithm[QUESTIONNAIRE_QUESTION_ID_2_STR] === props.question.id2Str">
          <Algorithm
            :group="group"
            :question="question"
            :groups="groups"
            v-model:algorithm="algorithms[algorithmIndex]"
            :algorithms="algorithms"
            :algorithm-index="algorithmIndex"
          />
          <!-- @delete-group="deleteGroup" -->
        </template>
      </template>
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn :text="$t('Back')" variant="outlined" :prepend-icon="ArrowLeftIcon" color="error" @click="emits('update:model-value', false)" />
      <v-spacer />

      <!-- <v-btn color="info" variant="outlined" @click="addGroup" :prepend-icon="PlusIcon" :text="$t('addGroup')"> </v-btn> -->
      <v-btn :text="$t('Save')" color="success" :prepend-icon="DeviceFloppyIcon" variant="outlined" @click="save" v-if="!view" />
    </v-card-actions>
  </v-card>
</template>
